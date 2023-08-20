from django.urls import path
from guideapp import views


urlpatterns = [
    path('',views.home, name="home" ),
    path('viewusers',views.viewusers, name="viewusers" ),
    path('createuser',views.createuser, name="createuser" ),
    path('userdatakey/<int:key>',views.userdatakey, name="userdatakey" ),
    
]
