//class
class Sprite{
    constructor({position,velocity,image,frames={max:1,hold :10}, sprites,animate=false})
    {
        this.position=position
        this.img=new Image()
        this.frames={...frames, val: 0, elapsed: 0}
        
        this.img.onload = () => {
          this.width = this.img.width / this.frames.max
          this.height = this.img.height
        }
        this.img.src=image.src
        this.animate=animate
        this.sprites=sprites
        this.opacity=1
       
        
    }
    
    draw()
    { cont.save()
      cont.globalAlpha=this.opacity
      cont.drawImage(this.img,
        this.frames.val*this.width,
        0,this.img.width/this.frames.max,this.img.height,
        this.position.x,this.position.y,
        this.img.width/this.frames.max,this.img.height)

        cont.restore()
        if(!this.animate)return

        if (this.frames.max > 1) {
            this.frames.elapsed++
          }
        
          if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
          }
          
    }

    
      } 

class Monster extends Sprite{
  constructor({position,velocity,image,frames={max:1,hold :10}, sprites,animate=false,attacks,enemy=false,name}){
   super({
    position,velocity,image,frames, sprites
  ,animate
   })
    this.enemy=enemy
    this.name=name
    this.health=100
    this.attacks=attacks
  }
  faint(){
    document.querySelector('#dialogueBox').innerHTML=
    this.name + " fainted!!"
    gsap.to(this.position,{
      y: this.position.y+20
    })

    gsap.to(this,{
      opacity:0
    })
    audio.battle.stop()
    audio.victory.play()
  }
  attack({attack,recipient,renderedimg}){
    document.querySelector('#dialogueBox').style.display="block"
    document.querySelector('#dialogueBox').innerHTML=this.name + " used "+attack.name+"..."
    let healthBar='#enemyHealth'
    if(this.enemy)healthBar='#playerHealth'
    recipient.health-=attack.damage

    switch(attack.name){
      case 'FireBall':
        audio.initFireball.play()
        const fireballImage=new Image()
        fireballImage.src='./img/fireball.png'
        const fire=new Sprite({
          position:{
            x: this.position.x,
            y: this.position.y
          },
          image:fireballImage,
          frames:{
            max:4,
            hold:10
          },
          animate:true
        })
        renderedimg.splice(1,0,fire)

        gsap.to(fire.position,{
          x:recipient.position.x,
          y:recipient.position.y,
          onComplete: ()=>{
            audio.fireballHit.play()
            gsap.to(healthBar,{
              width:recipient.health+ "%"
            })
            gsap.to(recipient.position,{
              x:recipient.position.x+10,
              duration:0.08,
              yoyo:true,
              repeat:5
            })
    
            gsap.to(recipient,{
              opacity: 0,
              repeat:5,
              yoyo:true,
              duration:0.08
            })
            renderedimg.splice(1,1)
          }
        })
        break
      case 'Tackle':
        const tl =gsap.timeline()

        let movementDist=30
        if(this.enemy)movementDist=-30
      
        tl.to(this.position, {
        x:this.position.x-movementDist
        }).to(this.position, {
        x:this.position.x+movementDist*1.5,
        duration: 0.1,
        onComplete:() =>{
          audio.tackleHit.play()
          gsap.to(healthBar,{
            width:recipient.health+ "%"
          })
          gsap.to(recipient.position,{
            x:recipient.position.x+10,
            duration:0.08,
            yoyo:true,
            repeat:5
          })
  
          gsap.to(recipient,{
            opacity: 0,
            repeat:5,
            yoyo:true,
            duration:0.08
          })
        }
        }).to(this.position, {
        x:this.position.x
        })
        
        break;
      }
    
    
    }
}
//canvas.width/2-this.img.width/2,canvas.height/2-this.img.height/2,
class Boundary
{
    constructor({position})
    {
        this.position=position
        this.height=48
        this.width=48
    }  
        draw()
        {
            cont.fillStyle= 'rgba(0,0,255,0.2)'
            cont.fillRect(this.position.x,this.position.y,this.width,this.height)
        }
}