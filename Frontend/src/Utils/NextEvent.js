export function NextEvent(currEvent,jobs){
    let ans=-1
    for(let i=0;i<jobs.length-1;i++){
        if(jobs[i].name===currEvent){
            ans=i+1
        }
    }
    return ans;
}