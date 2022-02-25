from platform import node
from pydoc_data.topics import topics
from django.shortcuts import render
from matplotlib.pyplot import title
from rest_framework import generics, status
from tables import Description
from .serializers import RoomSerializer, TopicSerializer
from .models import Room, Topic
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        host = self.request.session.session_key
        queryset = Room.objects.filter(host=host)
        if queryset.exists():
            room = queryset[0]
            Topic.objects.filter(room__host=host).delete()
            self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        else:

            room = Room(host=host)
            room.save()
            self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)



class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key #这里要看
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class AddTopic(APIView):
    serializer_class = TopicSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.GET.get('code')

        if not node:
            return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            time_last = serializer.data.get('time_last')
            description = serializer.data.get('description')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            topic = Topic(title=title, time_last=time_last, description=description)
            topic.save()
            room.topics.add(topic)
            return Response({'msg': 'successful!'}, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
    
class GetTopic(APIView):
    serializer_class = TopicSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            topic = Topic.objects.filter(id=id)
            if len(topic) > 0:
                data = TopicSerializer(topic[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Topic Not Found': 'Invalid Topic Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class EditTopic(APIView):
    serializer_class = TopicSerializer

    def put(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        id = request.GET.get('id')

        if not id:
            return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)    

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            time_last = serializer.data.get('time_last')
            description = serializer.data.get('description')

            queryset = Topic.objects.filter(id=id)
            if not queryset.exists():
                return Response({'msg': 'Topic not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = Room.objects.get(topics__id=id)
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            topic = queryset[0]
            topic.title = title
            topic.time_last = time_last
            topic.description = description
            topic.save(update_fields=['title', 'time_last', 'description'])
            return Response({'msg': 'successful!'}, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class DeleteTopic(APIView):

    def delete(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        id = request.GET.get('id')

        if not id:
            return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)    

        queryset = Topic.objects.filter(id=id)
        if not queryset.exists():
            return Response({'msg': 'Topic not found.'}, status=status.HTTP_404_NOT_FOUND)

        room = Room.objects.get(topics__id=id)
        user_id = self.request.session.session_key
        if room.host != user_id:
            return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

        queryset[0].delete()

        return Response({'msg': 'successful!'}, status=status.HTTP_200_OK)






        


