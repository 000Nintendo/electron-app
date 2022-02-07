import firebaseUploadService from 'firebase/services/uploadFiles';
import userServices from 'firebase/services/userServices';
import projectServices from 'firebase/services/projectServices';

/* eslint-disable prettier/prettier */
const { desktopCapturer } = window.require('electron');

class ScreenCaptureService {
  imageFormat = 'image/jpeg';

  captureScreen = async (mediaSources) => {
    mediaSources.forEach(async (source) => {
      if (
        source.name === 'Entire Screen' ||
        source.name === 'Screen 1' ||
        source.name === 'Screen 2'
      ) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 4000,
                minHeight: 720,
                maxHeight: 4000,
              },
            },
          });

          const video = document.createElement('video');
          video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
          video.srcObject = stream;

          video.onloadedmetadata = (event) => {
            video.style.width = `${event.currentTarget.videoWidth}px`;
            video.style.height = `${event.currentTarget.videoHeight}px`;
            video.play();

            const canvas = document.createElement('canvas');
            canvas.width = window.screen.width;
            canvas.height = window.screen.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL(this.imageFormat);
            video.remove();
            stream.getTracks()[0].stop();
            if (dataUrl) firebaseUploadService.uploadFile({ file: dataUrl });
            return dataUrl;
          };
        } catch (err) {
          console.log(
            'Something went wrong while generating stream for capturing the current screen: ',
            err
          );
        }
      }
    });
  };

  captureScreenShot = async () => {
    const mediaSources = await desktopCapturer.getSources({
      types: ['screen', 'window', 'desktop', 'monitor'],
    });
    this.captureScreen(mediaSources);
    projectServices.udpateProjectTrackingDetails();
    userServices.udpateUserTrackingDetails();
  };
}

const screenCaptureService = new ScreenCaptureService();

export default screenCaptureService;
