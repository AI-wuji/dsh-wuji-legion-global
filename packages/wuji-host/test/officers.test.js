import { officerAdviseTool,councilPlanTool } from '@wuji/dsh-wuji-host';
const events=[];const session={append(type,data){events.push({type,data})}};
const advice=await officerAdviseTool.execute({officer:'white-hat',adviceId:'a1',content:'有风险',evidence:'e1',affectedRequirement:'u1'},{agent:{session}});
if(advice.status!=='pending-user-decision'||events.length!==2)process.exit(1);
const council=await councilPlanTool.execute({explicitUserRequest:true,officers:['white-hat','audit'],artifact:'artifact-1'});
if(council.contracts.length!==2||council.contracts.some(x=>x.canModify))process.exit(1);
let refused=false;try{await councilPlanTool.execute({explicitUserRequest:false,officers:['white-hat','audit'],artifact:'x'})}catch{refused=true}if(!refused)process.exit(1);
console.log('officers test OK');
