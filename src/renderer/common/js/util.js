/**
 * Created by Administrator on 2017/12/22.
 */
function getRandomInt(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);

}

export function shuffle(arr){
  let _arr=arr.slice();
  for(let i=0;i<_arr.length;i++){
     let random=getRandomInt(0,_arr.length-1);
     let t=_arr[random];
     _arr[random]=_arr[i];
     _arr[i]=t;
  }
  return _arr;
}
