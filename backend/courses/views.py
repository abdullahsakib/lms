from rest_framework.viewsets import ModelViewSet
from .models import Category, Course
from .serializers import CategorySerializer, CourseSerializer

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()   
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        instructor = self.request.query_params.get("instructor")

        if category:
            qs = qs.filter(category__id=category)
        if instructor:
            qs = qs.filter(instructors__id=instructor)

        return qs