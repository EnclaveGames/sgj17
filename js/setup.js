function setup(imagesBasePaths, numberOfRuns, timeToEndScene){
'use strict'
let currentCorrectSymbolIndex;
const getRandomBasePathWithoutRepetitions = createRandomizerWithoutRepetitions(imagesBasePaths);
const overlay = document.querySelector('#overlay');
const cursor = document.querySelector('#cursor');
const runs = document.querySelectorAll('a-box.symbol');
let intervalId;
const electrictyDeathNode = document.querySelector('#electricity-death');
const drownDeathNode = document.querySelector('#drown-death');
const camera=document.querySelector('a-camera');
const win=document.querySelector('#win');

Array.from(runs).forEach(function(run){
  run.addEventListener('click',function(e){
      const fusedElementId = e.target.getAttribute('id');

      const elemIndex = fusedElementId.replace('symbol', '');
      if(elemIndex==currentCorrectSymbolIndex){
        console.log('win');
        handleNextScene();
      } else {
        camera.setAttribute('rotation', '-5 0 0');
        electrictyDeathNode.setAttribute('opacity', 1);
        handleFailure();
      }
  })

  run.addEventListener('fusing', function(e){
    const fusedElement = e.target;

    fusedElement.emit('on-focus-start');
  })

})


const timerNode = document.querySelector('#timer');

const sceneNode = document.querySelector('a-scene');

sceneNode.addEventListener('end-of-scenes', function(){
  camera.setAttribute('rotation', '-5 0 0');
  win.setAttribute('opacity', 1);
});



function setupScene(){
    const currentSceneImageBasePath = getRandomBasePathWithoutRepetitions()

    if(!currentSceneImageBasePath){
      sceneNode.emit('end-of-scenes');
      return;
    }
    camera.setAttribute('rotation', '-5 0 0');
    overlay.emit('light-on');

    setupRuns(currentSceneImageBasePath, numberOfRuns);
    setupTimer(timeToEndScene);
}

function createRandomizerWithoutRepetitions(arr){
return function(){
    const index= Math.floor(Math.random()*arr.length);
    const element = arr[index];

    arr.splice(index ,1);

    return element;
  }
}

function setupRuns(runsImageBasePath, numberOfRuns) {
  if(!runs.length || runs.length != numberOfRuns ){
    throw new Error('Incorrect number of a-run components. Expected numer: '+
    numberOfRuns+', Actual number: '+runs.length)
  }

  const imageFormat = '.png'

  const imagesIndecies = [];
  for(let i = 0; i<numberOfRuns; i++){
    imagesIndecies.push(i)
  }

  const getRandomWithoutRepetitions= createRandomizerWithoutRepetitions(imagesIndecies);

  Array.from(runs).forEach( function(run, runIndex){
    const index=getRandomWithoutRepetitions()
    if(index===0){
      currentCorrectSymbolIndex = runIndex+1;
      console.log('Correct '+runIndex);
    }
    run.setAttribute('src', runsImageBasePath+index+imageFormat)
  })

}

function setupTimer(timeToCompleteLevel){
  let timeLeft=timeToCompleteLevel;

  const getTimerValue = function(value){
    return '0:' + ((value<10)?'0'+value:value);
  }

  timerNode.setAttribute('value', getTimerValue(timeLeft));
  intervalId = setInterval(function(){
    timeLeft--;
    timerNode.setAttribute('value', getTimerValue(timeLeft));
    if(timeLeft === 0){
      clearInterval(intervalId);
      camera.setAttribute('rotation', '-5 0 0');
      drownDeathNode.setAttribute('opacity', 1);
    }
  }, 1000);
}

function handleNextScene(){
  overlay.emit('light-off');
  clearInterval(intervalId)
  setupScene();
}

function handleFailure(){
  clearInterval(intervalId)

}

setupScene();

}
