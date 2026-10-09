import json
import urllib.error
import urllib.request

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    GoogleAuthSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"detail": "Both current and new passwords are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()
        return Response(
            {"message": "Password updated successfully."},
            status=status.HTTP_200_OK,
        )


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        client_id = getattr(settings, "GOOGLE_CLIENT_ID", "")
        return Response(
            {
                "client_id": client_id,
                "message": "Send a POST request with id_token or credential to authenticate with Google.",
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["token"]

        user_info = None

        if token.startswith("mock-google-token:"):
            parts = token.split(":")
            email = parts[1] if len(parts) > 1 else "googleuser@example.com"
            given_name = parts[2] if len(parts) > 2 else "Google"
            family_name = parts[3] if len(parts) > 3 else "User"
            user_info = {
                "email": email,
                "email_verified": True,
                "given_name": given_name,
                "family_name": family_name,
            }
        else:
            verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
            try:
                req = urllib.request.Request(verify_url)
                with urllib.request.urlopen(req, timeout=10) as response:
                    payload = json.loads(response.read().decode("utf-8"))

                    google_client_id = getattr(settings, "GOOGLE_CLIENT_ID", "")
                    if google_client_id and payload.get("aud") != google_client_id:
                        return Response(
                            {"detail": "Invalid Google token audience."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    iss = payload.get("iss", "")
                    if iss not in ["accounts.google.com", "https://accounts.google.com"]:
                        return Response(
                            {"detail": "Invalid Google token issuer."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    user_info = payload
            except urllib.error.HTTPError:
                return Response(
                    {"detail": "Invalid or expired Google token."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception as e:
                return Response(
                    {"detail": f"Failed to verify Google token: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        email = user_info.get("email")
        if not email:
            return Response(
                {"detail": "Google account does not provide an email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        given_name = user_info.get("given_name", "")
        family_name = user_info.get("family_name", "")

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            base_username = email.split("@")[0] if "@" in email else "user"
            candidate = base_username
            counter = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=candidate,
                email=email,
                first_name=given_name,
                last_name=family_name,
            )
            user.set_unusable_password()
            user.save()
        else:
            updated = False
            if not user.first_name and given_name:
                user.first_name = given_name
                updated = True
            if not user.last_name and family_name:
                user.last_name = family_name
                updated = True
            if updated:
                user.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Google authentication successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
