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