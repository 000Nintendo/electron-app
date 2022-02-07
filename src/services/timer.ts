/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable prettier/prettier */

import screenCaptureService from './screenCapture';

interface IStartTimer {
  hours?: number;
  minutes?: number;
  milliSeconds: number;
}

interface IGenerateTimerString {
  seconds: number;
  removeSeconds?: boolean;
}

class TimerServices {
  projectDate = new Date();

  timerInterval: NodeJS.Timeout | undefined = undefined;

  userDate = new Date();

  projectSeconds = 0;

  previosProjectSeconds = 0;

  userSeconds = 0;

  previosUserSeconds = 0;

  taskSeconds = 0;

  previousTaskSeconds = 0;

  generateTwoDigitTimeString = (timeString: number) => {
    if (timeString.toString().length < 2) {
      return `0${timeString}`;
    }
    return timeString;
  };

  generateTimerString = ({
    seconds,
    removeSeconds = false,
  }: IGenerateTimerString): string => {
    const hrs = Math.trunc(seconds / (60 * 60));
    const mins = Math.trunc(Math.abs((seconds - hrs * 60 * 60) / 60));
    const sec = Math.trunc(Math.abs(seconds - hrs * 60 * 60 - mins * 60));

    const hrsString = this.generateTwoDigitTimeString(
      Math.trunc(Number(hrs.toPrecision(2)))
    );
    const minString = this.generateTwoDigitTimeString(
      Math.trunc(Number(mins.toPrecision(2)))
    );
    const secString = this.generateTwoDigitTimeString(
      Math.trunc(Number(sec.toPrecision(2)))
    );

    let generatedTimeString = `${hrsString}:${minString}:${secString}`;

    if (removeSeconds) {
      generatedTimeString = `${hrsString}:${minString}`;
    }

    return generatedTimeString;
  };

  startProjectTimer = ({ milliSeconds }: IStartTimer) => {
    let timeInms = milliSeconds;
    if (isNaN(milliSeconds)) {
      timeInms = 0;
    }
    let timeString = '00:00:00';
    this.projectSeconds =
      this.projectSeconds === 0 ? timeInms : this.projectSeconds + 1;

    if (this.previosProjectSeconds !== timeInms) {
      this.previosProjectSeconds = timeInms;
      this.previosProjectSeconds = timeInms;
    } else {
      this.projectSeconds =
        this.projectSeconds === 0 ? timeInms : this.projectSeconds + 1000;
    }
    if (this.projectSeconds === 0) {
      this.projectSeconds += 1000;
    }

    const seconds = this.projectSeconds / 1000;

    const generatedTimeString = this.generateTimerString({ seconds });
    if (generatedTimeString === 'NaN:NaN:NaN') {
      return timeString;
    }
    timeString = generatedTimeString;
    return timeString;
  };

  startUserTimer = ({ milliSeconds }: IStartTimer) => {
    let timeString = '00:00:00';
    let timeInms = milliSeconds;
    if (isNaN(milliSeconds)) {
      timeInms = 0;
    }
    if (this.previosUserSeconds !== timeInms) {
      this.previosUserSeconds = timeInms;
      this.userSeconds = timeInms;
    } else {
      this.userSeconds =
        this.userSeconds === 0 ? timeInms : this.userSeconds + 1000;
    }
    if (this.userSeconds === 0) {
      this.userSeconds += 1000;
    }

    const seconds = this.userSeconds / 1000;

    const generatedTimeString = this.generateTimerString({ seconds });

    if (generatedTimeString === 'NaN:NaN:NaN') {
      return timeString;
    }

    timeString = generatedTimeString;
    return timeString;
  };

  startTaskTimer = ({ milliSeconds }: IStartTimer) => {
    let timeString = '00:00';
    let timeInms = milliSeconds;
    if (isNaN(milliSeconds)) {
      timeInms = 0;
    }
    if (this.previousTaskSeconds !== timeInms) {
      this.previousTaskSeconds = timeInms;
      this.taskSeconds = timeInms;
    } else {
      this.taskSeconds =
        this.taskSeconds === 0 ? timeInms : this.taskSeconds + 1000;
    }
    if (this.taskSeconds === 0) {
      this.taskSeconds += 1000;
    }

    const seconds = this.taskSeconds / 1000;

    const generatedTimeString = this.generateTimerString({
      seconds,
      removeSeconds: true,
    });

    if (generatedTimeString === 'NaN:NaN') {
      return timeString;
    }

    timeString = generatedTimeString;
    return timeString;
  };

  generateRandomInterval = () => {
    const minInterval = 180000;
    const averageInterval = 240000;
    const maxInterval = 300000;

    const randomInterval = Number(
      Math.trunc(Math.random() * 1000000).toPrecision(4)
    );

    let i = 0;
    for (i; i <= 100; i++) {
      if (randomInterval >= minInterval && randomInterval <= maxInterval) {
        return randomInterval;
      }
    }
    return averageInterval;
  };

  startScreenShotTimer = async () => {
    const interval = this.generateRandomInterval();
    this.timerInterval = setTimeout(() => {
      screenCaptureService.captureScreenShot();
      clearTimeout(this.timerInterval as unknown as number);
      this.startScreenShotTimer();
    }, interval);
  };

  stopScreenShotTimer = () => {
    clearTimeout(this.timerInterval as unknown as number);
  };

  resetSeconds = () => {
    this.userSeconds = 0;
    this.projectSeconds = 0;
  };

  getMiliiSeconds = () => {
    return new Date().getTime().toString();
  };
}

const timerServices = new TimerServices();

export default timerServices;
