from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .utils.helper import *
from .utils.constants import *



"""
LIST OF DOWELL API SERVICES
"""
@method_decorator(csrf_exempt, name='dispatch')
class apiservices(APIView):
    def get(self, request):
        data = [
            {
                "api_service": "Living Lab scale",
                "document_link": "https://github.com/DoWellUXLab/Living-Lab-scale",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "Living Lab Chat",
                "document_link": "",
                "is_active": False,
                "is_released": False
            },
            {
                "api_service": "DoWell Open Source License Compatibility check",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Open-Source-License-Compatibility-check",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "UX Live",
                "document_link": "",
                "is_active": False,
                "is_released": False
            },
            {
                "api_service": "Statistical distributions from bigdata",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Statistical-distributions-from-bigdata",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "Dowell Payments",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Payments",
                "is_active": True,"is_released": True
            },
            {
                "api_service": "Dowell QR Code Generator",
                "document_link": "https://github.com/DoWellUXLab/Dowell-QR-Code-Generator",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "Dowell Email",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Email",
                "is_active": True,"is_released": True
            },
            {
                "api_service": "DoWell Sampling from big data",
                "document_link": "",
                "is_active": False,
                "is_released": False
            },
            {
                "api_service": "DoWell Permutations",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Permutation",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "DoWell Shuffling of Big data",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Shuffling-of-Big-data",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "Dowell Wifi QR Code",
                "document_link": "",
                "is_active": False,
                "is_released": False
            },
            {
                "api_service": "Living lab Maps",
                "document_link": "https://github.com/DoWellUXLab/Living-Lab-Maps",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "DoWell Secure repositories",
                "document_link": "",
                "is_active": False,
                "is_released": False
            },
            {
                "api_service": "DoWell Geometrical layout of Big Data",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Geometrical-layout-of-Big-Data",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "DoWell Central tendencies of Big data distributions",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Central-tendencies-of-Big-data-distributions",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service": "DoWell Coordinates",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Coordinates",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service":"DoWell Topic Generation",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Topic-Generation",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service":"DoWell Subscribe NewsLetter",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Subscribe-NewsLetter",
                "is_active": True,
                "is_released": True
            },
            {
                "api_service":"DoWell Login",
                "document_link": "https://github.com/DoWellUXLab/DoWell-Login.git",
                "is_active": True,
                "is_released": True
            }
        ]

        return Response({
            "success": True,
            "message": "List of Documentation",
            "data":data
        },status= status.HTTP_200_OK)

"""
GENERATE VOUCHERS
"""
