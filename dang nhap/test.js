const canvas = document.querySelector('canvas1');
const ctx = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


// function drawBgImg() {
//     let bgImg = new Image();
//     bgImg.src = '/images/1.jpg';
//     bgImg.onload = () => {
//         gCtx.drawImage(bgImg, 0, 0, gElCanvas.width, gElCanvas.height);
//     }
// }

class Boxing {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 50
        this.width = 17
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y

            },
            offset,
            width: 65,
            height: 7

        }
        this.color = color
        this.isAttacking
        this.health =100
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y,
            this.width, this.height)
        //attackBox
        if (this.isAttacking){
            ctx.fillStyle = "green"
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }

    }


    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y
            >= canvas.height) {
            this.velocity.y = 0
        } else
            this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

}
let audio = new Audio('./audio/jojo.mp3')
let audioMuda = new Audio('./audio/mudamuda.mp3')
let audioOre = new Audio('./audio/Ore.mp3')

const player = new Boxing({
    position: {
        x: 100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    }
})

// player.draw()

const enemy = new Boxing({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

// enemy.draw()
console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function rectangularCollistion({rectangular1, rectangular2}) {
    return (
        rectangular1.attackBox.position.x + rectangular1.attackBox.width >= rectangular2.position.x &&
        rectangular1.attackBox.position.x <= rectangular2.position.x + rectangular2.width &&
        rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y &&
        rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height
    )
}
// Tạo hàm check người chiến thắng
function checkWinner({player,enemy,stopTimer}){
    clearTimeout(stopTimer)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Anh bạn à , xin giảng hòa'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Người chơi bên 1 Thắng'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Người chơi bên 2 Thắng'
    }


}
// Xác định thời gian đếm ngược
let timer =50
let stopTimer
let count =0
function decreaseTime(){
    if (timer>0) {
        count++
        stopTimer=setTimeout(decreaseTime,1000)
        timer--
        document.querySelector('#timer').innerHTML=timer
    }
// Quyết định ai là người chiến thắng
    if (timer===0) {
        checkWinner({player,enemy,stopTimer})
    }
}
decreaseTime()
// let lastKey

function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    enemy.update()
    player.update()
    audio.play()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // player chuyen dong
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        console.log(player.position.x,'vi tri')
    }

// ennemy chuyen dong
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5

    }
//detect for collistion
    if (
        rectangularCollistion({
            rectangular1: player,
            rectangular2: enemy
        }) &&
        player.isAttacking

    ) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'

    }

    if (
        rectangularCollistion({
            rectangular1: enemy,
            rectangular2: player
        }) &&
        enemy.isAttacking

    ) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

// Check va cham voi canvas
    console.log('vi tri enemy',enemy.position.x)
    if (player.position.x <= 0) {
        player.velocity.x = 2
        player.update()
    } else if (player.attackBox.position.x + player.width >= 1024) {
        player.velocity.x = -2
        player.update()
    } else if (enemy.position.x<=0){
        enemy.velocity.x = 2
        enemy.update()
    }else if (enemy.position.x+enemy.width>=1024){
        enemy.velocity.x = -2
        enemy.update()
    }

// Trường hợp đối phương chết trước khi hết time đếm
    if (enemy.health <= 0 ){
        checkWinner({player,enemy,stopTimer})
        enemy.velocity.y=100*gravity
    }else if(player.health<=0){
        checkWinner({player,enemy,stopTimer})
        player.velocity.y=3*gravity;

    }
}


// hoi thoai
document.querySelector('#talk1').style.display = 'flex'
if (count===2) {
    document.querySelector('#talk1').innerHTML = 'jotarsddddddddddo'
}





animate()

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case'w':
            if (player.attackBox.position.y<=0){
                player.velocity.y=5
                player.update()
            }else
                player.velocity.y = -20
            break;
        case ' ':
            player.attack()
            audioMuda.play()
            break



        // nut cua enemy
        case'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break;
        case'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break;
        case'ArrowUp':
            if (enemy.attackBox.position.y<=0){
                enemy.velocity.y=5
                enemy.update()
            }else
                enemy.velocity.y = -20
            break;
        case'Enter':
            enemy.attack()
            audioOre.play()
            break;
    }
})
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case'd':
            keys.d.pressed = false
            break;
        case'a':
            keys.a.pressed = false
            break;
        case'w':
            keys.w.pressed = false
            break;
    }
    switch (event.key) {
        case'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})
