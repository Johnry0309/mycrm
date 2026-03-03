from rest_framework import serializers
from .models import CRMItem, Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class CRMItemSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    # Explicitly make image optional in the serializer
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CRMItem
        fields = '__all__'