import React, { useRef, useEffect, useState} from 'react';
import grassTile from "./sprites/tiles/grass.png";
import pistolPlayer from "./sprites/player/pistol.png";
import pistolPlayerLeft from "./sprites/player/pistolLeft.png";
import pistolPlayerRight from "./sprites/player/pistolRight.png";
import riflePlayer from "./sprites/player/rifle.png";
import riflePlayerLeft from "./sprites/player/rifleLeft.png";
import riflePlayerRight from "./sprites/player/rifleRight.png";
import smgPlayer from "./sprites/player/smg.png";
import smgPlayerLeft from "./sprites/player/smgLeft.png"
import smgPlayerRight from "./sprites/player/smgRight.png"
import sniperPlayer from "./sprites/player/sniper.png";
import sniperPlayerLeft from "./sprites/player/sniperLeft.png"
import sniperPlayerRight from "./sprites/player/sniperRight.png"
import bullet from "./sprites/projectiles/bullet.png";
import muzzleFlash from "./sprites/effects/muzzleFlash.png";
import zombie from "./sprites/enemies/zombie.png";
import zombieLeft from "./sprites/enemies/zombieLeft.png";
import zombieRight from "./sprites/enemies/zombieRight.png";
import zombieBrute from "./sprites/enemies/zombieBrute.png";
import zombieBruteLeft from "./sprites/enemies/zombieBruteLeft.png";
import zombieBruteRight from "./sprites/enemies/zombieBruteRight.png";
import coinIcon from "./sprites/ui/coin.png";
import ammoIcon from "./sprites/ui/ammo.png";
import ShopColumn from './ShopColumn';
import pistolIcon from "./sprites/ui/pistolIcon.png";
import rifleIcon from "./sprites/ui/rifleIcon.png";
import smgIcon from "./sprites/ui/smgIcon.png";
import sniperIcon from "./sprites/ui/sniperIcon.png";

function sqrtApprox(num) {
  let s = ((num/2) + num/(num/2))/2;
  for (let i = 1; i <= 4; i++) {
    s = (s+num/s)/2
  }
  return s
}



function Game({spawned, setSpawned, ...props}) {
  const canvasRef = useRef(null)
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight})
  let waveStarted = false
  let wave = 0;
  let playerPos = {x: 0, y: 0};
  let wDown = false;
  let aDown = false;
  let sDown = false;
  let dDown = false;
  let mouseDown = false;
  let mousePos = {x: 0, y: 0};
  let playerRotation = 0;
  let bullets = []
  let canShoot = true;
  let drawFlash = false;
  let zombies = []
  let died = false;
  let particleEffects = []
  let money = 35;
  let equipped = 0;
  let ammo = 15;
  let maxAmmo = 15;
  let reloadTime = 2000;
  let reloading = false;
  let damage = 10;
  let shopDisplayed = false;
  let pistolMaxAmmo = 15;
  let rifleMaxAmmo = 30;
  let smgMaxAmmo = 25;
  let sniperMaxAmmo = 5;
  let pistolDamage = 10;
  let rifleDamage = 15;
  let smgDamage = 10;
  let sniperDamage = 30;
  let pistolSpread = 15;
  let rifleSpread = 8;
  let smgSpread = 35;
  let sniperSpread = 0;
  let pistolCooldown = 500;
  let rifleCooldown = 250;
  let smgCooldown = 150;
  let sniperCooldown = 1000;
  let pistolSpeed = 9;
  let rifleSpeed = 12;
  let smgSpeed = 9;
  let sniperSpeed = 12;
  let pistolReload = 2000;
  let rifleReload = 3000;
  let smgReload = 2000;
  let sniperReload = 3000;
  let pistolCost = 5;
  let rifleCost = 25;
  let smgCost = 15;
  let sniperCost = 35;
  let pistolLevel = 1;
  let rifleLevel = 1;
  let smgLevel = 1;
  let sniperLevel = 1;
  let equippedName = "Pistol";
  let spawnedLocal = false;
  const buySound = document.getElementById("buySound");
  const hitSound = document.getElementById("hitSound");
  const equipSound = document.getElementById("equipSound");
  const buttonSound = document.getElementById("buttonSound");
  const shootSounds = [document.getElementById("shootSound"), 
    document.getElementById("shootSound2"), 
    document.getElementById("shootSound3"), 
    document.getElementById("shootSound4")]
  const gameOverSound = document.getElementById("gameOverSound");
  const reloadSound = document.getElementById("reloadSound");
  const shopOpenSound = document.getElementById("shopOpenSound");
  const shopCloseSound = document.getElementById("shopCloseSound");
  const deathSound = document.getElementById("deathSound");
  

  // Set money function
  function setMoney(value) {
    money = value;
    document.getElementById("coinText").innerHTML = money;

    // Update shop display
    if (sniperCost > money) {
      const buyButton = document.getElementById("SniperBuyButton");
      buyButton.classList.add("disabled");
      buyButton.disabled = true;
    } else {
      const buyButton = document.getElementById("SniperBuyButton");
      buyButton.classList.remove("disabled");
      buyButton.disabled = false;
    }

    if (pistolCost > money) {
      const buyButton = document.getElementById("PistolBuyButton");
      buyButton.classList.add("disabled");
      buyButton.disabled = true;
    } else {
      const buyButton = document.getElementById("PistolBuyButton");
      buyButton.classList.remove("disabled");
      buyButton.disabled = false;
    }

    if (rifleCost > money) {
      const buyButton = document.getElementById("RifleBuyButton");
      buyButton.classList.add("disabled");
      buyButton.disabled = true;
    } else {
      const buyButton = document.getElementById("RifleBuyButton");
      buyButton.classList.remove("disabled");
      buyButton.disabled = false;
    }

    if (smgCost > money) {
      const buyButton = document.getElementById("SMGBuyButton");
      buyButton.classList.add("disabled");
      buyButton.disabled = true;
    } else {
      const buyButton = document.getElementById("SMGBuyButton");
      buyButton.classList.remove("disabled");
      buyButton.disabled = false;
    }
  }

  // Buy/upgrade clicked
  function BuyClicked(button, gun) {
    buySound.play()
    if (button.innerHTML == "Buy") {
      // Buy weapon
      button.innerHTML = "Upgrade"
      document.getElementById(gun + "EquipButton").style.display = "inline";
      setMoney(money -  document.getElementById(gun + "Cost").innerHTML);
    } else {
      // Upgrade weapon
      switch (gun) {
        case "Pistol":
          const originalCostP = pistolCost;
          pistolCost = Math.floor(pistolCost*1.3);
          setMoney(money - originalCostP);
          document.getElementById("PistolCost").innerHTML = pistolCost;
          pistolLevel += 1;
          document.getElementById("PistolLevel").innerHTML = "Level: " + pistolLevel;
          pistolDamage += 2;
          document.getElementById("PistolDamage").innerHTML = pistolDamage;
          if (pistolSpread > 5 && pistolLevel % 5 == 0) {
            pistolSpread -= 1;
            document.getElementById("PistolAccuracy").innerHTML = Math.floor(100 - pistolSpread*100/40);
          }
          if (pistolMaxAmmo < 30 && pistolLevel % 5 == 2) {
            pistolMaxAmmo += 1;
            document.getElementById("PistolMaxAmmo").innerHTML = pistolMaxAmmo;
          }
          if (pistolReload > 500 && pistolLevel % 10 == 1) {
            pistolReload -= 250;
            document.getElementById("PistolReloadSpeed").innerHTML = 100-Math.floor(pistolReload*100/3500);
          }
          if (pistolCooldown > 50 && pistolLevel % 20 == 3) {
            pistolCooldown -= 50;
            document.getElementById("PistolFireRate").innerHTML = 100 - Math.floor(pistolCooldown*100/1500);
          }
          if (pistolSpeed < 15 && pistolLevel % 20 == 4) {
            pistolSpeed += 1;
            document.getElementById("PistolBulletSpeed").innerHTML = pistolSpeed;
          }
          break;
        case "Rifle":
          const originalCostR = rifleCost;
          rifleCost = Math.floor(rifleCost*1.4);
          setMoney(money - originalCostR);
          document.getElementById("RifleCost").innerHTML = rifleCost;
          rifleLevel += 1;
          document.getElementById("RifleLevel").innerHTML = "Level: " + rifleLevel;
          rifleDamage += 2;
          document.getElementById("RifleDamage").innerHTML = rifleDamage;
          if (rifleSpread > 3 && rifleLevel % 5 == 0) {
            rifleSpread -= 1;
            document.getElementById("RifleAccuracy").innerHTML = Math.floor(100 - rifleSpread*100/40);
          }
          if (rifleMaxAmmo < 60 && rifleLevel % 5 == 2) {
            rifleMaxAmmo += 1;
            document.getElementById("RifleMaxAmmo").innerHTML = rifleMaxAmmo;
          }
          if (rifleReload > 750 && rifleLevel % 10 == 1) {
            rifleReload -= 250;
            document.getElementById("RifleReloadSpeed").innerHTML = 100-Math.floor(rifleReload*100/3500);
          }
          if (rifleCooldown > 150 && rifleLevel % 20 == 3) {
            rifleCooldown -= 50;
            document.getElementById("RifleFireRate").innerHTML = 100 - Math.floor(rifleCooldown*100/1500);
          }
          if (rifleSpeed < 15 && rifleLevel % 20 == 4) {
            rifleSpeed += 1;
            document.getElementById("RifleBulletSpeed").innerHTML = rifleSpeed;
          }
          break;
        case "SMG":
          const originalCostS = smgCost;
          smgCost = Math.floor(smgCost*1.3);
          setMoney(money - originalCostS);
          document.getElementById("SMGCost").innerHTML = smgCost;
          smgLevel += 1;
          document.getElementById("SMGLevel").innerHTML = "Level: " + smgLevel;
          smgDamage += 2;
          document.getElementById("SMGDamage").innerHTML = smgDamage;
          if (smgSpread > 15 && smgLevel % 5 == 0) {
            smgSpread -= 1;
            document.getElementById("SMGAccuracy").innerHTML = Math.floor(100 - smgSpread*100/40);
          }
          if (smgMaxAmmo < 45 && smgLevel % 5 == 2) {
            smgMaxAmmo += 1;
            document.getElementById("SMGMaxAmmo").innerHTML = smgMaxAmmo;
          }
          if (smgReload > 500 && smgLevel % 10 == 1) {
            smgReload -= 250;
            document.getElementById("SMGReloadSpeed").innerHTML = 100-Math.floor(smgReload*100/3500);
          }
          if (smgCooldown > 50 && smgLevel % 20 == 3) {
            smgCooldown -= 50;
            document.getElementById("SMGFireRate").innerHTML = 100 - Math.floor(smgCooldown*100/1500);
          }
          if (smgSpeed < 15 && smgLevel % 20 == 4) {
            smgSpeed += 1;
            document.getElementById("SMGBulletSpeed").innerHTML = smgSpeed;
          }
          break;
        case "Sniper":
          const originalCostSp = sniperCost;
          sniperCost = Math.floor(sniperCost*1.3);
          setMoney(money - originalCostSp);
          document.getElementById("SniperCost").innerHTML = sniperCost;
          sniperLevel += 1;
          document.getElementById("SniperLevel").innerHTML = "Level: " + sniperLevel;
          sniperDamage += 5;
          document.getElementById("SniperDamage").innerHTML = sniperDamage;
          if (sniperMaxAmmo < 15 && sniperLevel % 5 == 2) {
            sniperMaxAmmo += 1;
            document.getElementById("SniperMaxAmmo").innerHTML = sniperMaxAmmo;
          }
          if (sniperReload > 750 && sniperLevel % 10 == 1) {
            sniperReload -= 250;
            document.getElementById("SniperReloadSpeed").innerHTML = 100-Math.floor(sniperReload*100/3500);
          }
          if (sniperCooldown > 150 && sniperLevel % 20 == 3) {
            sniperCooldown -= 50;
            document.getElementById("SniperFireRate").innerHTML = 100 - Math.floor(sniperCooldown*100/1500);
          }
          break;
      }
    }
  }
  
  // Equip gun
  function EquipClicked(button, gun) {
    equipSound.play();
    const equipButton = document.getElementById(equippedName + "EquipButton");
    equipButton.innerHTML = "Equip";
    equipButton.classList.remove("disabled");
    equipButton.disabled = false;
    equippedName = gun;
    const newEquipButton = document.getElementById(gun + "EquipButton");
    newEquipButton.innerHTML = "Equipped";
    newEquipButton.classList.add("disabled");
    newEquipButton.disabled = true;
    equippedName = gun;
    switch (gun) {
      case "Pistol":
        damage = pistolDamage;
        maxAmmo = pistolMaxAmmo;
        ammo = maxAmmo;
        document.getElementById("ammoText").innerHTML = ammo;
        reloadTime = pistolReload;
        equipped = 0;
        break;
      case "Rifle":
        damage = rifleDamage;
        maxAmmo = rifleMaxAmmo;
        ammo = maxAmmo;
        document.getElementById("ammoText").innerHTML = ammo;
        reloadTime = rifleReload;
        equipped = 1;
        break;
      case "Sniper":
        damage = sniperDamage;
        maxAmmo = sniperMaxAmmo;
        ammo = maxAmmo;
        document.getElementById("ammoText").innerHTML = ammo;
        reloadTime = sniperReload;
        equipped = 3;
        break;
      case "SMG":
        damage = smgDamage;
        maxAmmo = smgMaxAmmo;
        ammo = maxAmmo;
        document.getElementById("ammoText").innerHTML = ammo;
        reloadTime = smgReload;
        equipped = 2;
        break;
    }

  }

  function shoot (x, y, spread, speed, offsetX, offsetY) {
    shootSounds[Math.floor(Math.random() * 4)].play();
    const direction = (playerRotation * -1) - Math.PI/2 + Math.random()*spread/100-spread/200;
    let vx = Math.cos(direction) * speed;
    let vy = Math.sin(direction) * -1 * speed;
    let xAdd = Math.cos(playerRotation) * offsetX + Math.cos(playerRotation + Math.PI/2) * offsetY;
    let yAdd = (Math.sin(playerRotation) * offsetX + Math.sin(playerRotation + Math.PI/2) * offsetY);
    bullets.push({x: x + xAdd, y: y + yAdd, vx: vx, vy: vy})
    drawFlash = true;
  }

  // Draw function
  const draw = (ctx, frameCount, sprites, muzzleOffsetX, muzzleOffsetY) => {
    // Get frames for animations
    const cWalk = Math.floor(frameCount/8) % 4;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // Draw background
    for (let i = 0; i < size.width; i+= 48) {
      for (let j = 0; j < size.height; j+= 48) {
        ctx.save();
        
        ctx.translate(i, j)
        ctx.rotate(Math.PI*(i + j))
        ctx.drawImage(sprites.grassImg, 0, 0)
        ctx.restore()
      }
    }

    if (spawned && !died) {
      // Draw player
      ctx.save()
      ctx.translate(ctx.canvas.width/2 + playerPos.x, ctx.canvas.height/2 + playerPos.y)
      ctx.rotate(playerRotation)
      let img = sprites.playerImg;
      if ((wDown !== sDown || aDown !== dDown) && !shopDisplayed) {
        if (cWalk === 1) {
          img = sprites.playerImgRight;
        } else if (cWalk === 3) {
          img = sprites.playerImgLeft;
        }
      } else {
        img = sprites.playerImg;
      }
      ctx.drawImage(img, -sprites.playerImg.width/2, -sprites.playerImg.height/2)
      ctx.restore()
    }
    
    // Draw bullets
    for (let i = 0; i < bullets.length; i++) {
      ctx.drawImage(sprites.bulletImg, bullets[i].x + ctx.canvas.width/2 - sprites.bulletImg.width/2, bullets[i].y + ctx.canvas.height/2  - sprites.bulletImg.height/2);
    }

    // Draw muzzle flash if necessary
    if (drawFlash) {
      ctx.save()
      ctx.translate(ctx.canvas.width/2 + playerPos.x, ctx.canvas.height/2 + playerPos.y)
      ctx.rotate(playerRotation)
      ctx.drawImage(sprites.muzzleFlashImg, -sprites.muzzleFlashImg.width/2 + muzzleOffsetX, -sprites.muzzleFlashImg.height/2 + muzzleOffsetY)
      ctx.restore()
      setTimeout(() => drawFlash=false, 100)
    }

    // Draw zombies
    for (let i = 0; i < zombies.length; i++) {
      const c = Math.floor(Math.round(frameCount*zombies[i].speed)/24) % 4;
      let zombieImg = sprites.zombieImg;
      let zombieImgLeft = sprites.zombieImgLeft;
      let zombieImgRight = sprites.zombieImgRight;
      if (zombies[i].brute) {
        zombieImg = sprites.zombieBruteImg;
        zombieImgLeft = sprites.zombieBruteImgLeft;
        zombieImgRight = sprites.zombieBruteImgRight;
      }
      ctx.save()
      ctx.translate(ctx.canvas.width/2 + zombies[i].x, ctx.canvas.height/2 + zombies[i].y)
      ctx.rotate(zombies[i].rotation)
      let img = zombieImg;
      if (!died) {
        if (c === 1) {
          img = zombieImgRight;
        } else if (c === 3) {
          img = zombieImgLeft;
        }
      }
      ctx.drawImage(img, -img.width/2, -img.height/2)
      ctx.restore()
    }

    // Draw particle effects
    for (let i = 0; i < particleEffects.length; i++) {
      ctx.globalAlpha = particleEffects[i].lifespan/30
      ctx.fillStyle = "red"
      ctx.fillRect(particleEffects[i].x + ctx.canvas.width/2, particleEffects[i].y + ctx.canvas.height/2, particleEffects[i].size, particleEffects[i].size)
      ctx.globalAlpha=1;
    }
  }

  // Get mouse movements
  window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  })

  // Track player inputs
  window.addEventListener('keydown', (event) => {
    if (event.key === 'w') wDown = true;
    if (event.key === 's') sDown = true;
    if (event.key === 'd') dDown = true;
    if (event.key === 'a') aDown = true;
    if (event.key === 'r' && spawnedLocal && !died && !reloading) {
      canShoot = false;
      reloading = true;
      document.body.classList.add("reloading");
      reloadSound.play();
      
      setTimeout(() => {
        if (spawnedLocal) {
          document.body.classList.remove("reloading")
          reloading = false;
          canShoot = true;
          ammo = maxAmmo;
          document.getElementById("ammoText").innerHTML = maxAmmo;
        }
      }, reloadTime)
    }
    if (event.key === 'b' && spawnedLocal && !died) {
      if (shopDisplayed) {
        document.getElementById("shopDisplay").style.top = "-100vw";
        shopDisplayed = false;
        shopCloseSound.play();
        setTimeout(() => {
          shopCloseSound.pause();
          shopCloseSound.currentTime = 0;
        }, 300)
      } else {
        document.getElementById("shopDisplay").style.top = "0vw";
        shopDisplayed = true;
        shopOpenSound.play();
        setTimeout(() => {
          shopOpenSound.pause();
          shopOpenSound.currentTime = 0;
        }, 300)
      }
      
      
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'w') wDown = false;
    if (event.key === 's') sDown = false;
    if (event.key === 'd') dDown = false;
    if (event.key === 'a') aDown = false;
  });

  window.addEventListener('mousedown', (event) => {
    if (event.target.id != "startWaveButton") {
      mouseDown = true;
      if (spawnedLocal && canShoot && ammo > 0 && !reloading && !shopDisplayed && !died) {
        if (equipped === 0) {
          shoot(playerPos.x, playerPos.y, pistolSpread, pistolSpeed, 7, 29);
          canShoot = false;
          ammo -= 1;
          document.getElementById("ammoText").innerHTML = ammo;
          setTimeout(() => canShoot = true, 500)
        } else if (equipped === 3) {
          shoot(playerPos.x, playerPos.y, sniperSpread, sniperSpeed, 5.5, 33);
          canShoot = false;
          ammo -= 1;
          document.getElementById("ammoText").innerHTML = ammo;
          setTimeout(() => canShoot = true, 1000)
        }
      } 
    } 
  })

  window.addEventListener('mouseup', (event) => {
    mouseDown = false;
  })

  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const fps = 60;
    

    // Equip pistol
    const pistolEquipButton = document.getElementById("PistolEquipButton");
    if (pistolEquipButton) {
      const pistolBuyButton = document.getElementById("PistolBuyButton");
      pistolBuyButton.innerHTML = "Upgrade";
      pistolEquipButton.style.display = "inline";
      pistolEquipButton.innerHTML = "Equipped";
      pistolEquipButton.classList.add("disabled")
      pistolEquipButton.disabled = true;
    }

    if (spawned) {
      spawnedLocal = true;
      setMoney(0);
    }

    // Load images
    const grassImg = new Image();
    grassImg.src=grassTile;
    const pistolPlayerImg = new Image();
    pistolPlayerImg.src=pistolPlayer
    const pistolPlayerImgLeft = new Image();
    pistolPlayerImgLeft.src = pistolPlayerLeft;
    const pistolPlayerImgRight = new Image();
    pistolPlayerImgRight.src = pistolPlayerRight;
    const riflePlayerImg = new Image();
    riflePlayerImg.src=riflePlayer
    const riflePlayerImgLeft = new Image();
    riflePlayerImgLeft.src = riflePlayerLeft;
    const riflePlayerImgRight = new Image();
    riflePlayerImgRight.src = riflePlayerRight;
    const smgPlayerImg = new Image();
    smgPlayerImg.src=smgPlayer
    const smgPlayerImgLeft = new Image();
    smgPlayerImgLeft.src = smgPlayerLeft;
    const smgPlayerImgRight = new Image();
    smgPlayerImgRight.src = smgPlayerRight;
    const sniperPlayerImg = new Image();
    sniperPlayerImg.src=sniperPlayer
    const sniperPlayerImgLeft = new Image();
    sniperPlayerImgLeft.src = sniperPlayerLeft;
    const sniperPlayerImgRight = new Image();
    sniperPlayerImgRight.src = sniperPlayerRight;

    const bulletImg = new Image();
    bulletImg.src = bullet;
    const muzzleFlashImg = new Image();
    muzzleFlashImg.src = muzzleFlash;

    const zombieImg = new Image();
    zombieImg.src = zombie;
    const zombieImgLeft = new Image();
    zombieImgLeft.src = zombieLeft;
    const zombieImgRight = new Image();
    zombieImgRight.src = zombieRight;
    const zombieBruteImg = new Image();
    zombieBruteImg.src = zombieBrute;
    const zombieBruteImgLeft = new Image();
    zombieBruteImgLeft.src = zombieBruteLeft;
    const zombieBruteImgRight = new Image();
    zombieBruteImgRight.src = zombieBruteRight;
  
    // Scale canvas with screen resize
    let resizeTimer;
    window.addEventListener('resize', (e) => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => setSize({width: window.innerWidth, height: window.innerHeight }), 100)
    })

    

    let frameCount = 0
    let animationFrameId
    
    // Game loop
    const render = () => {
      console.log(spawnedLocal, spawned);
      frameCount++

      // Move particles
      let newParticleEffects = []
      for (let i = 0; i < particleEffects.length; i++) {
        particleEffects[i].x += particleEffects[i].vx;
        particleEffects[i].vx *= 0.95;
        particleEffects[i].y += particleEffects[i].vy;
        particleEffects[i].vy *= 0.95;
        particleEffects[i].lifespan -= 1;
        if (particleEffects[i].lifespan > 0) {
          newParticleEffects.push(particleEffects[i]);
        }
        
      }
      particleEffects = newParticleEffects;

      if (!died) {
        // Shoot automatic weapons
        if (spawned && canShoot && mouseDown && ammo > 0 && !reloading && !shopDisplayed && !died) {
          if (equipped === 1) {
            shoot(playerPos.x, playerPos.y, rifleSpread, rifleSpeed, 5.5, 33);
            canShoot = false;
            ammo -= 1;
            document.getElementById("ammoText").innerHTML = ammo;
            setTimeout(() => canShoot = true, 250)
          } else if (equipped === 2) {
            shoot(playerPos.x, playerPos.y, smgSpread, smgSpeed, 5.5, 33);
            canShoot = false;
            ammo -= 1;
            document.getElementById("ammoText").innerHTML = ammo;
            setTimeout(() => canShoot = true, 50)
          }
        }

        // Move player
        if (spawned && !shopDisplayed) {
          let speed = 4;
          if ((wDown != sDown) == (aDown != dDown)) {
            speed = 2.83;
          }
          if (wDown && playerPos.y > -size.height/2) playerPos.y -= speed;
          if (sDown && playerPos.y < size.height/2) playerPos.y += speed;
          if (aDown && playerPos.x > -size.width/2) playerPos.x -= speed;
          if (dDown && playerPos.x < size.width/2) playerPos.x += speed;
        }

        // Get player rotation
        if (!shopDisplayed) {
          const playerScreenPos = {x: playerPos.x + context.canvas.width/2, y: playerPos.y + context.canvas.height/2}
          const dx = mousePos.x - playerScreenPos.x;
          const dy = mousePos.y - playerScreenPos.y;
          playerRotation = Math.atan(Math.abs(dy)/Math.abs(dx))
          if(dx < 0 && dy > 0) {
            playerRotation += Math.PI;
          }
          else if (dx < 0) {
            playerRotation *= -1
            playerRotation += Math.PI;
          }
          else if (dy > 0) {
            playerRotation *= -1;
            playerRotation += 0;
          }
          playerRotation += Math.PI/2;
          playerRotation *= -1
        }
        
      
        // Move bullets
        let newBullets = []
        for (let i = bullets.length-1; i >= 0; i--) {
          bullets[i].x += bullets[i].vx;
          bullets[i].y += bullets[i].vy;
          // Check if it collided with zombie
          let hitZombie = false;
          for (let j = zombies.length-1; j >= 0; j--) {
            const distance = sqrtApprox((zombies[j].x - bullets[i].x)**2 + (zombies[j].y - bullets[i].y)**2)
            if (distance < 25 || (distance < 40 && zombies[j].brute)) {
              hitSound.play();
              hitZombie = true;
              zombies[j].health -= damage;
              if (zombies[j].health <= 0) {
                for (let i = 0; i < 20; i++) {
                  particleEffects.push({x: zombies[j].x + Math.random() * 5 - 2.5, y: zombies[j].y + Math.random() * 5 - 2.5, vx: Math.random()*8 - 4, vy: Math.random()*8 -4, lifespan: 30, size: 6})
                }
                zombies.splice(j, 1);
                deathSound.play();
                if (zombies.length == 0) {
                  waveStarted = false;
                  document.getElementById("startWaveButton").style.display = "inline"
                }
                setMoney(money + Math.floor(Math.random() * 5) + 1);
                document.getElementById("coinText").innerHTML = money;

              } else {
                for (let i = 0; i < 5; i++) {
                  particleEffects.push({x: zombies[j].x + Math.random() * 5 - 2.5, y: zombies[j].y + Math.random() * 5 - 2.5, vx: Math.random()*8 - 4, vy: Math.random()*8 -4, lifespan: 30, size: 6})
                }
              }
              break;
            }
          }

          if (!(hitZombie || bullets[i].x + context.canvas.width/2 > context.canvas.width || bullets[i].x + context.canvas.width/2 < 0 || bullets[i].y + context.canvas.height/2  < 0 || bullets[i].y + context.canvas.height/2 > context.canvas.height)) {
            newBullets.push(bullets[i])
          }
        }
        bullets = newBullets;

        // Move zombies and detect if player died
        for (let i = 0; i < zombies.length; i++) {
          const dx = playerPos.x - zombies[i].x;
          const dy = playerPos.y - zombies[i].y;
          let zombieRotation = Math.atan(Math.abs(dy)/Math.abs(dx))
          if(dx < 0 && dy > 0) {
            zombieRotation += Math.PI;
          }
          else if (dx < 0) {
            zombieRotation *= -1
            zombieRotation += Math.PI;
          }
          else if (dy > 0) {
            zombieRotation *= -1;
            zombieRotation += 0;
          }
          zombieRotation += Math.PI/2;
          zombieRotation *= -1
          zombies[i].rotation = zombieRotation;
          zombies[i].x += -Math.sin(zombieRotation)*zombies[i].speed;
          zombies[i].y += Math.cos(zombieRotation)*zombies[i].speed;

          const distance = sqrtApprox((zombies[i].x - playerPos.x)**2 + (zombies[i].y - playerPos.y)**2)
          if (distance < 35) {
            for (let i = 0; i < 20; i++) {
              particleEffects.push({x: playerPos.x + Math.random() * 5 - 2.5, y: playerPos.y + Math.random() * 5 - 2.5, vx: Math.random()*8 - 4, vy: Math.random()*8 -4, lifespan: 30, size: 6})
            }
            died = true;
            document.body.classList.remove("reloading");
            if ((localStorage.getItem("ZFHighScore") && localStorage.getItem("ZFHighScore") < wave - 1) || !localStorage.getItem("ZFHighScore")) {
              localStorage.setItem("ZFHighScore", wave-1);
              // Submit to leaderboard
              try {
                fetch("https://zfr-backend.vercel.app/api/addScore", {
                  method: "POST", 
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({username: props.username, waves: wave-1})
                }).then((res) => res.json()).then((data) => console.log(data))
              } catch (error) {
                  console.log(error);
              }
            }
            setTimeout(() => {
              setSpawned(false);
              spawnedLocal = false;
            }, 1000)
            gameOverSound.play();
          }
        }
      }

      

      // Draw frame
      let playerImg = pistolPlayerImg;
      let playerImgLeft = pistolPlayerImgLeft;
      let playerImgRight = pistolPlayerImgRight;
      let muzzleOffsetX = 5.5;
      let muzzleOffsetY = 39;
      switch (equipped) {
        case 1:
          playerImg = riflePlayerImg;
          playerImgLeft = riflePlayerImgLeft;
          playerImgRight = riflePlayerImgRight;
          muzzleOffsetX = 3;
          muzzleOffsetY = 45;
          break;
        case 2:
          playerImg = smgPlayerImg;
          playerImgLeft = smgPlayerImgLeft;
          playerImgRight = smgPlayerImgRight;
          break;
        case 3:
          playerImg = sniperPlayerImg;
          playerImgLeft = sniperPlayerImgLeft;
          playerImgRight = sniperPlayerImgRight;
          muzzleOffsetX = 5;
          muzzleOffsetY = 45;
          break;
        default:
      }
      draw(context, frameCount, {
        grassImg: grassImg, 
        playerImg: playerImg, 
        playerImgRight: playerImgRight, 
        playerImgLeft: playerImgLeft, 
        bulletImg:  bulletImg, 
        muzzleFlashImg: muzzleFlashImg, 
        zombieImg: zombieImg,
        zombieImgLeft: zombieImgLeft,
        zombieImgRight: zombieImgRight,
        zombieBruteImg: zombieBruteImg,
        zombieBruteImgLeft: zombieBruteImgLeft,
        zombieBruteImgRight: zombieBruteImgRight
      }, muzzleOffsetX, muzzleOffsetY)
      animationFrameId = setTimeout(render, 1000/fps)
    }
    render()
    
    return () => {
     clearTimeout(animationFrameId)
    }
  }, [draw])
  
  return (<>
    <canvas width={size.width} height={size.height} style={{zIndex: "-1", position: "fixed", left: "0vw", top: "0vw"}} ref={canvasRef} {...props}/>
    {spawned && <>
      <button id="startWaveButton" onClick={(e)=> {
        waveStarted = true; 
        buttonSound.play();
        wave += 1;
        document.getElementById("waveText").innerHTML = "Wave: " + wave;
        e.target.style.display = "none";
        // Spawn zombies
        const sizeMax = Math.max(size.width/2, size.height/2);
        if (wave % 10 == 0) {
          for (let i = 0; i < 10; i++) {
            const angle = Math.random()*2*Math.PI;
            const multiplier = 1 + i/5;
            zombies.push({x: Math.cos(angle)*multiplier*sizeMax, y: Math.sin(angle)*multiplier*sizeMax, health: (100 + 100 * Math.floor((wave - 1)/10)), speed: 3 + (Math.random() * 2 - 1), rotation: 0, brute: false})
          }
          const angle = Math.random()*2*Math.PI;
          const multiplier = 2;
          zombies.push({x: Math.cos(angle)*multiplier*sizeMax, y: Math.sin(angle)*multiplier*sizeMax, health: (100 + 100 * Math.floor((wave - 1)/10))*3, speed: 2, rotation: 0, brute: true})
        } else {
          for (let i = 0; i < wave % 10; i++) {
            const angle = Math.random()*2*Math.PI;
            const multiplier = 1 + i/5;
            zombies.push({x: Math.cos(angle)*multiplier*sizeMax, y: Math.sin(angle)*multiplier*sizeMax, health: (100 + 100 * Math.floor((wave - 1)/10)), speed: 3 + (Math.random() * 2 - 1), rotation: 0, brute: false})
          }
        }
        
        }} className={"textButton strokedText3 pixelFont textColor"} style={{fontSize: "3vw", position: "absolute", left: "1vw", top: "1vw"}}>Start Wave</button>
        <label id={"waveText"} className={"strokedText3 pixelFont textColor"} style={{userSelect: "none", fontSize: "3vw", position: "absolute", right: "1vw", top: "1vw"}}>Wave: 0</label>
        <div style={{userSelect: "none", position: "absolute", bottom: "5vw", left: "1vw", display: "flex", alignItems: "center", height: "3vw"}}>
          <img src={ammoIcon} style={{width: "51px", height: "39px", marginRight: "1vw"}}></img>
          <h1 id="ammoText" className={"strokedText3 pixelFont textColor"} style={{fontSize: "3vw"}}>15</h1>
        </div>
        <div style={{userSelect: "none", position: "absolute", bottom: "1vw", left: "1vw", display: "flex", alignItems: "center", height: "3vw"}}>
          <img src={coinIcon} style={{width: "39px", height: "39px", marginRight: "1vw"}}></img>
          <h1 id="coinText" className={"strokedText3 pixelFont textColor"} style={{fontSize: "3vw"}}>0</h1>
        </div>

        {/*Shop*/}
        <div id={"shopDisplay"} style={{transitionDuration: "0.3s", position: "absolute", top: "-100vw", left: "0vw", display: "flex", height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center"}}>
          <ShopColumn bc={BuyClicked} ec={EquipClicked} name="Pistol" icon={pistolIcon} bulletSpeed={pistolSpeed} damage={pistolDamage} accuracy={Math.floor(100 - pistolSpread*100/40)} fireRate={100 - Math.floor(pistolCooldown*100/1500)} maxAmmo={pistolMaxAmmo} reloadSpeed={100-Math.floor(pistolReload*100/3500)} cost={pistolCost}/>
          <ShopColumn bc={BuyClicked} ec={EquipClicked} name="Rifle" icon={rifleIcon} bulletSpeed={rifleSpeed} damage={rifleDamage} accuracy={Math.floor(100 - rifleSpread*100/40)} fireRate={100 - Math.floor(rifleCooldown*100/1500)} maxAmmo={rifleMaxAmmo} reloadSpeed={100-Math.floor(rifleReload*100/3500)} cost={rifleCost}/>
          <ShopColumn bc={BuyClicked} ec={EquipClicked} name="SMG" icon={smgIcon} bulletSpeed={smgSpeed} damage={smgDamage} accuracy={Math.floor(100 - smgSpread*100/40)} fireRate={100 - Math.floor(smgCooldown*100/1500)} maxAmmo={smgMaxAmmo} reloadSpeed={100-Math.floor(smgReload*100/3500)} cost={smgCost}/>
          <ShopColumn bc={BuyClicked} ec={EquipClicked} name="Sniper" icon={sniperIcon} bulletSpeed={sniperSpeed} damage={sniperDamage} accuracy={Math.floor(100 - sniperSpread*100/40)} fireRate={100 - Math.floor(sniperCooldown*100/1500)} maxAmmo={sniperMaxAmmo} reloadSpeed={100-Math.floor(sniperReload*100/3500)} cost={sniperCost}/>
        </div>
      </>}
  </>)
}

export default Game