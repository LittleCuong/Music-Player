// 1. Render songs
// 3. Play/pause/seek
// 4. CD rotate
// 5. Next/prev
// 6. Random
// 7. Next/repeat when end
// 8. ACtive song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'NEW_PLAYER'


const menuMobileButton = $('.mobile-menu-button')
const navbar = $('.navbar')
const musicList = $('.music-list--body')
const musicIsPlaying = $('.music-playing-control')
const heading = $('.music-playing-header--name')
const musicPlayingName = $('.music-playing-name')
const cdThumb = $('.music-playing-img')
const musicPlayingAuthor = $('.music-playing-author')
const musicPlayingImg = $('.music-playing-img')
const playButon = $('.btn-toggle-play')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const numberOfPopularSong = $('.music-list-description')
const likeSongBtn = $('.music-infor--like')
const upperBody = $('.upper-body')
const postMalone = $('.post-malone')
const maroon5 = $('.maroon-5')
const theWeeknd = $('.the-weeknd')
const kda = $('.k-d-a')
const imagineDragons = $('.imagine-dragons')
const vu = $('.vu')
const clientID = '331ec2d4422e40158118ed7027542e1b'
const clientSecret = 'cdbfe903116848bf98cf47ad3ab24f22'



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isLiked: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Save Your Tears',
            singer: 'The Weeknd',
            path: './musics/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Light Switch',
            singer: 'Charlie Puth',
            path: './musics/song2.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'I Like You',
            singer: 'Post Malone',
            path: './musics/song3.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Wrecked',
            singer: 'Imagine Dragons',
            path: './musics/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Red Right Hand',
            singer: 'Nick Cave And The Bad Seeds',
            path: './musics/song5.mp3',
            image: './img/thomas.jpg'
        },
        {
            name: 'Goodbyes',
            singer: 'Post Malone',
            path: './musics/song6.mp3',
            image: './img/song3.jpg'
        },
        {
            name: "Won't Go Home Without you",
            singer: 'Maroon 5',
            path: './musics/song7.mp3',
            image: './img/song6.jpg'
        },
        {
            name: "It's Time",
            singer: 'Imagine Dragons',
            path: './musics/song8.mp3',
            image: './img/imagedragon.jpg'
        },
        {
            name: 'Sugar',
            singer: 'Maroon 5',
            path: './musics/sugar.mp3',
            image: './img/song6.jpg'
        },
        {
            name: 'Circles',
            singer: 'Post Malone',
            path: './musics/circles.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Sunflower - Spider-Man: Into The Spider-Verse',
            singer: 'Post Malone, Swae Lee',
            path: './musics/sunflower.mp3',
            image: './img/sunflower.jpg'
        },
        {
            name: 'Sharks',
            singer: 'Imagine Dragons',
            path: './musics/sharks.mp3',
            image: './img/sharks.jpg'
        },
    ],

    // hàm render
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="music-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"">
                    <div class="music-infor">
                        <img class="music-infor--img" src="${song.image}" alt="">
                        <span class="music-infor--number">${index+1}</span>
                        <span class="music-infor--name">${song.name}</span>
                        <span class="music-infor--divider">-</span>
                        <span class="music-infor--author">${song.singer}</span>
                        <i class="music-infor--like ti-heart"></i>
                    </div>               
                </div>
            `  
        })
        musicList.innerHTML = htmls.join('')   
        numberOfPopularSong.innerText = this.songs.length + ' songs';      
    },

    // Định nghĩa thuộc tính
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this

        menuMobileButton.onclick = () => {
            Object.assign(navbar.style, {
                height: '230px',
                opacity: '1',
            })
        }

        // CD rotate
        const cdThumbAnimated = musicPlayingImg.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimated.pause()

        // Play audio
        playButon.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi nhạc phát
        audio.onplay = function () {                    
            _this.isPlaying = true             
            musicList.classList.add('playing');
            musicIsPlaying.classList.add('isPlaying')
            cdThumbAnimated.play();
        }
        
        // Khi nhạc dừng
        audio.onpause = function () {
            _this.isPlaying = false
            musicList.classList.remove('playing')
            musicIsPlaying.classList.remove('isPlaying')
            cdThumbAnimated.pause()
        }

        // Tiến độ bài hát
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // Xử lý tua nhạc
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }

        // Next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Repeat song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Khi end song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Chọn bài hát
        musicList.onclick = function (e) {
            const songNode = e.target.closest('.music-item:not(.active)')
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong();
                _this.render();
                audio.play()
            }
        }
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    
    loadCurrentSong: function () {
        // Heading và cd 
        heading.textContent = this.currentSong.name
        musicPlayingImg.src = this.currentSong.image

        // tên bài hát và ca sĩ
        musicPlayingName.textContent = this.currentSong.name
        musicPlayingAuthor.textContent = this.currentSong.singer

        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex++
        // Nếu current lớn độ dài của mảng thì quay về 0
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300);
    },

    // hàm start
    start: function () {
        this.loadConfig();
        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();
    },

    
}

app.start()