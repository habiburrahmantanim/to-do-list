from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read / update serializer used by the /auth/me/ endpoint."""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "profile_picture",
        )
        read_only_fields = ("id", "username", "email")


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        )

    def validate(self, data):
        password = data.get("password")
        password_confirm = data.get("password_confirm")

        if password_confirm is not None and password != password_confirm:
            raise serializers.ValidationError("Passwords do not match.")

        username = data.get("username")
        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})

        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm", None)
        password = validated_data.pop("password")

        username = validated_data.get("username")
        if not username:
            email = validated_data.get("email", "")
            base_username = email.split("@")[0] if "@" in email else "user"
            candidate = base_username
            counter = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{base_username}{counter}"
                counter += 1
            validated_data["username"] = candidate

        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username and not email:
            raise serializers.ValidationError("Username or email is required.")

        login_identifier = username or email
        user = None

        if "@" in login_identifier:
            try:
                user_obj = User.objects.get(email__iexact=login_identifier)
                user = authenticate(username=user_obj.username, password=password)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                pass

        if user is None:
            user = authenticate(username=login_identifier, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid credentials.")

        data["user"] = user
        return data


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=False)
    credential = serializers.CharField(required=False)

    def validate(self, data):
        token = data.get("id_token") or data.get("credential")
        if not token:
            raise serializers.ValidationError("id_token or credential is required.")
        data["token"] = token
        return data