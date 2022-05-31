const progressBarContainer = document.querySelector("#top_progress_bar");
const progressBar = document.querySelector("#top_progress");

export const setProgress = progress => {

  progressBar.style.width = `${ progress }%`;

};

export const resetProgress = () => {

  progressBar.style.width = '0%';

};

export const showProgressBar = () => {

  progressBarContainer.style.display = 'flex';

};

export const hideProgressBar = () => {

  setTimeout(() => {

    resetProgress();

    progressBarContainer.style.display = 'none';

  }, 600);

};