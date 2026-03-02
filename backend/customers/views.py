from rest_framework import viewsets
from .models import CRMItem, Review
from .serializers import CRMItemSerializer, ReviewSerializer

class CRMItemViewSet(viewsets.ModelViewSet):
    queryset = CRMItem.objects.all()
    serializer_class = CRMItemSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer