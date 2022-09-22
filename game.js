const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
const  background =new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'
})
const  shop =new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale:2.75,
    framesMax:6
})
const player = new Boxing({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc:'./img/player/Idle (1).png',
    framesMax:8,
    scale:2.5,
    offset:{
        x:215,
        y:205
    },
    sprites:{
        idle:{
            imageSrc:'./img/player/Idle (1).png',
            framesMax:8,
        },
        run:{
            imageSrc:'./img/player/Run (1).png',
            framesMax:8,
        },
        jump:{
            imageSrc:'./img/player/Jump (1).png',
            framesMax:2,
        },
        fall:{
            imageSrc:'./img/player/Fall (1).png',
            framesMax:2,
        },
        attack1:{
            imageSrc:'./img/player/Attack1.player.png',
            framesMax:6,
        }
    },
    attackBox:{
        offset:{
            x:75,
            y:0
        },
        width:170,
        height:50
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
        x: -60,
        y: 0
    },
    imageSrc:'./img/enemy/Idle.png',
    framesMax:4,
    scale:2.5,
    offset:{
        x:215,
        y:222
    },
    sprites:{
        idle:{
            imageSrc:'./img/enemy/Idle.png',
            framesMax:4,
        },
        run:{
            imageSrc:'./img/enemy/Run.png',
            framesMax:8,
        },
        jump:{
            imageSrc:'./img/enemy/Jump.png',
            framesMax:2,
        },
        fall:{
            imageSrc:'./img/enemy/Fall.png',
            framesMax:2,
        },
        attack1:{
            imageSrc:'./img/enemy/Attack1.png',
            framesMax:4,
        }
    },
    attackBox:{
        offset:{
            x:-190,
            y:0
        },
        width:180,
        height:50
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

decreaseTime()
// let lastKey

function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    enemy.update()
    player.update()
    audio.play()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // player chuyen dong

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
    // nhay
    if (player.velocity.y<0){
        player.switchSprite('jump')
    }else if (player.velocity.y>0){
        player.switchSprite('fall')


    }

// ennemy chuyen dong
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }
    // nhay
    if (enemy.velocity.y<0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y>0){
        enemy.switchSprite('fall')
        console.log(enemy.velocity.y)

    }
//detect for collistion
    if (
        rectangularCollistion({
            rectangular1: player,
            rectangular2: enemy
        }) &&
        // tính đòn đánh khi hoạt ảnh thứ 4 nằng trong 8 hoạt anh của nhân vật chém
        player.isAttacking && player.framesCurrent === 4

    ) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
  // neu nguoi choi chem truot thi khi di chuyn gan doi phuong k dc lam doi phuong mat mau
    if ( player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }
// =================================== don danh ennemy=========================

    if (
        rectangularCollistion({
            rectangular1: enemy,
            rectangular2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent===2

    ) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    //   // neu nguoi choi chem truot thi khi di chuyn gan doi phuong k dc lam doi phuong mat mau
    if ( enemy.isAttacking && enemy.framesCurrent === 2){
       enemy.isAttacking = false}
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
    }else if(player.health<=0){
        checkWinner({player,enemy,stopTimer})

    }
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
