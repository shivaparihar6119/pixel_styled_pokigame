
const monsters={
    Emby:{
        position:{
            x: 370,
            y:350
          },
          image:{
            src:'./img/embySprite.png'
          },
          frames:{ max: 4,  hold: 30},
          animate: true,
          enemy:false,
          name:'Emby',
          attacks:[attacks.Tackle,attacks.FireBall]
    },
    Draggle:{
        position:{
            x: 1100,
            y:40
          },
          image:{
            src:'./img/draggleSprite.png'
          },
          frames:{ max: 4,  hold: 30},
          animate: true,
          enemy:true,
          name:'Draggle',
          attacks:[attacks.Tackle,attacks.FireBall]
    }
}