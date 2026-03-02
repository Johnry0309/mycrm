from django.db import models
from django.contrib.auth.models import User

class CRMItem(models.Model):
    owner = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='crm_images/', blank=True, null=True)
    is_active = models.BooleanField(default=False)  # False = "New", True = "Current"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        ratings = self.reviews.all()
        if not ratings.exists():
            return 0
        return round(
            sum([r.stars for r in ratings]) / ratings.count(),
            1
        )


class Review(models.Model):
    item = models.ForeignKey(
        CRMItem,
        related_name='reviews',
        on_delete=models.CASCADE
    )
    stars = models.IntegerField(default=1)  # 1-10 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stars} stars for {self.item.title}"