/* eslint-disable prettier/prettier */
import { Notyf, INotyfOptions } from 'notyf';

class NotificationServices {
  notyfConfiguration = {
    duration: 5000,
    dismissible: true,
    position: {
      x: 'left',
      y: 'bottom',
    },
    ripple: true,
  } as INotyfOptions;

  error = (message: string) => {
    return new Notyf(this.notyfConfiguration).error(message);
  };

  success = (message: string) => {
    return new Notyf(this.notyfConfiguration).success(message);
  };
}

const notificationServices = new NotificationServices();

export default notificationServices;
