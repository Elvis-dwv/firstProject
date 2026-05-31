const playlist = [
  {
    title: 'Addicted',
    artist: 'Rema',
    src: 'mp3/Rema-Addicted-(TrendyBeatz.com).mp3',
    cover: 'jpg/rema.jpg'
  },
  {
    title: 'Trap Out The Submarine',
    artist: 'Rema',
    src: 'mp3/Rema-Trap-Out-The-Submarine.mp3',
    cover: 'jpg/rema-2.jpg'
  },
  {
    title: 'Spaceship Jocelyn',
    artist: 'Rema',
    src: 'mp3/Rema-Spaceship-Jocelyn.mp3',
    cover: 'jpg/rema-3.jpg'
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');
const coverEl = document.getElementById('cover-image');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistList = document.getElementById('playlist-list');

let isShuffle = false;
let repeatMode = 0; // 0 = none, 1 = repeat all, 2 = repeat one

function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[index];
  audio.src = track.src;
  coverEl.src = track.cover;
  coverEl.alt = `${track.title} cover`;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  updatePlaylistUI();
  progressBar.value = 0;
  updateProgressFill(0);
  audio.load();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = '⏸️';
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
}

function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
}

function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.classList.toggle('active', repeatMode > 0);
  repeatBtn.textContent = repeatMode === 2 ? '🔂' : '🔁';
}

function updateOptionButtons() {
  shuffleBtn.classList.toggle('active', isShuffle);
  repeatBtn.classList.toggle('active', repeatMode > 0);
  repeatBtn.textContent = repeatMode === 2 ? '🔂' : '🔁';
}

function nextTrack() {
  let nextIndex;

  if (repeatMode === 2) {
    nextIndex = currentTrackIndex;
  } else if (isShuffle) {
    nextIndex = Math.floor(Math.random() * playlist.length);
    if (playlist.length > 1 && nextIndex === currentTrackIndex) {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
  } else {
    nextIndex = currentTrackIndex + 1;
    if (nextIndex >= playlist.length) {
      if (repeatMode === 1) {
        nextIndex = 0;
      } else {
        pauseTrack();
        return;
      }
    }
  }

  loadTrack(nextIndex);
  playTrack();
}

function prevTrack() {
  let prevIndex;
  if (isShuffle) {
    prevIndex = Math.floor(Math.random() * playlist.length);
  } else {
    prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeatMode === 1 ? playlist.length - 1 : 0;
    }
  }
  loadTrack(prevIndex);
  playTrack();
}

function updatePlaylistUI() {
  playlistList.innerHTML = '';
  playlist.forEach((track, index) => {
    const listItem = document.createElement('li');
    const titleSpan = document.createElement('strong');
    titleSpan.textContent = track.title;
    const artistSpan = document.createElement('span');
    artistSpan.textContent = track.artist;
    listItem.appendChild(titleSpan);
    listItem.appendChild(artistSpan);
    listItem.classList.toggle('active', index === currentTrackIndex);
    listItem.addEventListener('click', () => {
      loadTrack(index);
      playTrack();
    });
    playlistList.appendChild(listItem);
  });
}

function updateProgressFill(value) {
  progressBar.style.background = `linear-gradient(90deg, #1db954 ${value}%, rgba(255, 255, 255, 0.12) ${value}%)`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  totalDurationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  updateProgressFill(progressPercent);
});

audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    loadTrack(currentTrackIndex);
    playTrack();
  } else {
    nextTrack();
  }
});

progressBar.addEventListener('input', () => {
  if (!audio.duration) return;
  const value = progressBar.value;
  audio.currentTime = (value / 100) * audio.duration;
  updateProgressFill(value);
});

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
shuffleBtn.addEventListener('click', () => {
  toggleShuffle();
});
repeatBtn.addEventListener('click', () => {
  toggleRepeat();
});
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

loadTrack(currentTrackIndex);
updateOptionButtons();
volumeSlider.value = 1;
audio.volume = 1;
