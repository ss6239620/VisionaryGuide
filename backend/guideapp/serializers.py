from.models import Register
from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    key = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    phone1 = serializers.IntegerField()
    phone2 = serializers.IntegerField()
    from datetime import datetime
    date = serializers.DateField(default=datetime.now)

      

    def create(self, validated_data):
        return Register.objects.create(**validated_data)

    def update(self, register, validated_data):
        newregister = Register(**validated_data)
        newregister.id = register.id
        newregister.save()
        return newregister


