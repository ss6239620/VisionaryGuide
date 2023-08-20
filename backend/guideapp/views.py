from django.shortcuts import render, HttpResponse
from guideapp.models import *

# api related imports
from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import status



# Create your views here.
def home(request):
    return HttpResponse("Soham")


# api requests views
@csrf_exempt
def viewusers(request):
    emp = Register.objects.all()
    so = RegisterSerializer(emp, many=True)
    return JsonResponse(so.data, safe=False)



# @csrf_exempt
# def blogkeyview(request, key):

#     try:
#         blog = Blog.objects.get(key=key)
    
#     except Blog.DoesNotExist:
#         return HttpResponse(status=404)

#     # delete endpoint
#     if request.method == 'DELETE':
#         blog.delete()
#         return HttpResponse(status= 202)

#     # read endpoint
#     elif request.method == 'GET':
#         serializer = BlogSerializer(blog)
#         return JsonResponse(serializer.data, safe=False)

#     # update endpoint
#     elif request.method == 'PUT':
#         jsonData = JSONParser().parse(request)
#         serializer = BlogSerializer(blog, data= jsonData)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data , safe=False)
        
#         else:
#             return JsonResponse(serializer.errors , safe=False)
        



@csrf_exempt
def createuser(request):
    if request.method == 'GET':
        emp = Register.objects.all()
        so = RegisterSerializer(emp, many=True)
        return JsonResponse(so.data, safe=False)
    # create endpoint
    elif request.method == 'POST':
        jsonData = JSONParser().parse(request)
        serializer = RegisterSerializer(data= jsonData)
        if serializer.is_valid():
            employee_instance = serializer.save()  # Save the instance and get the saved object
            return JsonResponse(serializer.data, safe=False)
        
        else:
            return JsonResponse(serializer.errors , safe=False)
        