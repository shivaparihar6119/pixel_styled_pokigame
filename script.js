const canvas=document.querySelector('canvas')
const cont=canvas.getContext('2d')
canvas.width =1400
canvas.height= 650
const boundaries=[]
const collisionMap=[],battlezonesMap=[]
const offset={x: -230,y: -630}
//audio
let clicked=false
addEventListener('click',()=>{
  if(!clicked){
    audio.Map.play()
    clicked=true
  }
})

const img=new Image()
img.src='./img/Pallet Town.png'

const foregroundimg=new Image()
foregroundimg.src='./img/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

cont.fillStyle= 'white'
cont.fillRect(0,0,canvas.width,canvas.height)

for(let i=0;i<collision.length;i+=80)
{
    collisionMap.push(collision.slice(i,i+80))
}

for(let i=0;i<battleZonesData.length;i+=80)
{
    battlezonesMap.push(battleZonesData.slice(i,i+80))
}

collisionMap.forEach((row,i) =>{
    row.forEach((symbol,j) =>{
        if(symbol===1025)
        boundaries.push(new Boundary({position : {x :j*48+offset.x,y :i*48+offset.y}
        }))
    })
}
)

const battleZones=[]
battlezonesMap.forEach((row,i) =>{
  row.forEach((symbol,j) =>{
      if(symbol===1025)
      battleZones.push(new Boundary({position : {x :j*48+offset.x,y :i*48+offset.y}
      }))
  })
}
)



const keys = {
    w: {
      pressed: false
    },
    a: {
      pressed: false
    },
    s: {
      pressed: false
    },
    d: {
      pressed: false
    }
  }

const background = new Sprite({
    position: {
      x: offset.x,
      y: offset.y
    },
    image: img
  })

 const foreground = new Sprite({
    position: {
      x: offset.x,
      y: offset.y
    },
    image: foregroundimg
  })

const player=new Sprite({
  position:{
    x:canvas.width/2-192/2,
    y:canvas.height/2-68/2
  }
  ,image:playerDownImage
  ,frames: {max:4, hold:10}
  ,sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const testboundary=new Boundary({position:{x:400,y :400 }})
const battle={
  initiated:false
}
const movables=[background,...boundaries,foreground,...battleZones]

function checkCollision( {rectangle1,rectangle2} )
{
  return (rectangle1.position.x+rectangle1.width >= rectangle2.position.x 
    &&rectangle1.position.x <= rectangle2.position.x+rectangle2.width
    && rectangle1.position.y <= rectangle2.position.y+rectangle2.height
    && rectangle1.position.y+rectangle1.height >= rectangle2.position.y)
   
}

function animate()
{   const animationId=window.requestAnimationFrame(animate)   
    background.draw()

    boundaries.forEach(boundary =>
       { boundary.draw() 
      
      })

      battleZones.forEach(battleZone =>
        { battleZone.draw() 
       
       })
        player.draw()
       foreground.draw()
       let moving =true     
    player.animate=false

    if(battle.initiated)return
    if(keys.w.pressed||keys.a.pressed||keys.s.pressed||keys.d.pressed)
    {  
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
      if (
        checkCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) && overlappingArea > (player.width * player.height) / 2 && Math.random()<0.05
      ) {
        window.cancelAnimationFrame(animationId)
        audio.Map.stop()
        audio.initbattle.play()
        audio.battle.play()
        battle.initiated=true
        gsap.to('#overlappingDiv',{ opacity:1,
          repeat:3,
          yoyo: true,
        duration: 0.3,
        onComplete() {
          gsap.to('#overlappingDiv', {
            opacity: 1,
            duration: 0.4,
            onComplete(){
              initbattle()
             createBattle()
            gsap.to('#overlappingDiv', {
              opacity: 0,
              duration: 0.4
            })
           } 
          })
          
      } 
    })
        
        break
      }
    }
    }  
    
    if(keys.w.pressed && lastKey==='w')
    { player.animate=true
      player.img=player.sprites.up
      for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        checkCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
    }
        
    else if(keys.s.pressed && lastKey==='s')
    { player.animate=true
      player.img=player.sprites.down
      for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        checkCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
    }
    else if(keys.a.pressed && lastKey=='a')
    { player.animate=true
      player.img=player.sprites.left
      for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        checkCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x+3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
    }
    else if(keys.d.pressed && lastKey=='d')
    { player.animate=true
      player.img=player.sprites.right
      for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        checkCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x-3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
    }

}
let lastKey=''
 animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: -150
  },
  image: battleBackgroundImage
})


let draggle
let emby
let renderedimg
let queue
function initbattle(){
  clicked=true
  document.querySelector('#userInterface').style.display= 'block'
  document.querySelector('#dialogueBox').style.display= 'none'
  document.querySelector('#enemyHealth').style.width='100%'
  document.querySelector('#playerHealth').style.width='100%'
  document.querySelector('#attacksBox').replaceChildren()
  draggle=new Monster(monsters.Draggle)
  emby=new Monster(monsters.Emby)
  renderedimg=[draggle,emby]
   queue=[]
  emby.attacks.forEach((attack)=>{
    const button=document.createElement('button')
    button.innerHTML=attack.name
    document.querySelector('#attacksBox').append(button)
  })

  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click',(e) =>{
      const selectedAttack=attacks[e.currentTarget.innerHTML]
      emby.attack({
        attack:selectedAttack,
        recipient: draggle,
        renderedimg
      })
      if(draggle.health<=0){
        queue.push(()=>{
          draggle.faint()
        })
        queue.push(() =>{
          gsap.to('#overlappingDiv',{
            opacity: 1,
            onComplete: () =>{
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display='none'
              gsap.to('#overlappingDiv',{
                opacity: 0,
              })
              battle.initiated=false
              audio.Map.play()
            }
          })
        }) 
      }
      const randomAttack=draggle.attacks[Math.floor(Math.random()*draggle.attacks.length)]
      queue.push(()=>{
        draggle.attack({
          attack:randomAttack,
          recipient:emby,
          renderedimg
        })
        if(emby.health<=0){
          queue.push(()=>{
            
            emby.faint()
          })
          queue.push(() =>{
            gsap.to('#overlappingDiv',{
              opacity: 1,
              onComplete: () =>{
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display='none'
                gsap.to('#overlappingDiv',{
                  opacity: 0,
                })
                battle.initiated=false
                audio.Map.play()
              }
            })
          }) 
        }
      })
    })
    button.addEventListener('mouseenter',(e) =>{
      const selectedAttack=attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML=selectedAttack.type
      document.querySelector('#attackType').style.color=selectedAttack.color
    })
  })
  
  
}
let battleAnimationId
function createBattle()
{
  battleAnimationId=window.requestAnimationFrame(createBattle)
  battleBackground.draw()
  
  renderedimg.forEach((sprite)=>{
    sprite.draw()
  })
}
// initbattle()
// createBattle()

document.querySelector('#dialogueBox').addEventListener('click',(e) =>{
  if(queue.length>0){
    queue[0]()
    queue.shift()
  }
  else
  e.currentTarget.style.display="none"
})
window.addEventListener('keydown',(e) =>{
    switch(e.key)
    {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
    }

})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
      case 's':
        keys.s.pressed = false
        break
      case 'd':
        keys.d.pressed = false
        break
    }
  })