from rest_framework import serializers
from .models import Category, Course
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    # read
    category_name = serializers.ReadOnlyField(source="category.name")
    instructors_names = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="username"
    )

    
    instructors = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True
    )

    class Meta:
        model = Course
        fields = "__all__"