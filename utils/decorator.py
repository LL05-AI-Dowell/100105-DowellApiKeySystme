from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def protector(password):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(self, request, *args, **kwargs):
            if request.GET.get('password') == password:
                return view_func(self, request, *args, **kwargs)
            else:
                return Response({
                    "success": False,
                    "message": "This is a protected route"
                }, status=status.HTTP_403_FORBIDDEN)
        return _wrapped_view
    return decorator