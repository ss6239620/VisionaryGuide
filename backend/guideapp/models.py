from django.db import models

# Create your models here.

class Register(models.Model):
    key = models.IntegerField()
    username = models.TextField()
    email = models.EmailField()
    phone1 = models.IntegerField()
    phone2 = models.IntegerField()
    # from datetime import datetime
    # date = models.DateField(default=datetime.now)
    
    def __str__(self):
        return self.key 