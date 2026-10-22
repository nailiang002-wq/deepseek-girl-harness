// These masks split the existing transparent pose into a fixed body and a tail.
// The tail's root stays under the dress; no new character artwork is substituted.
const TAIL_EDGES={
 idle:[[127,350],[176,365],[176,399],[151,478],[130,536]],
 thinking:[[149,332],[196,345],[191,392],[163,458],[143,511]],
 generating:[[149,339],[196,353],[186,402],[160,470],[141,527]],
 success:[[146,354],[193,369],[190,403],[165,478],[139,544]],
 error:[[147,356],[195,373],[194,407],[169,481],[146,532]],
 dragging:[[135,378],[183,395],[174,430],[150,477],[133,526]],
 drop:[[151,354],[200,371],[194,408],[165,470],[144,519]],
 sleeping:[[147,349],[196,366],[190,404],[166,473],[145,525]],
 eating:[[124,350],[173,389],[166,421],[139,484],[112,540]],
 begging:[[138,357],[186,379],[180,411],[155,477],[138,528]],
 petting:[[130,343],[178,360],[173,395],[147,463],[126,522]],
 pouting:[[140,353],[188,373],[180,414],[158,483],[138,534]]
};
export function proTailRig(state){
 const edge=TAIL_EDGES[state]||TAIL_EDGES.idle,first=edge[0],last=edge.at(-1);
 const point=([x,y])=>(x/512*100).toFixed(4)+'% '+(y/768*100).toFixed(4)+'%';
 const body=[[0,0],[512,0],[512,768],[0,768],[0,last[1]],...edge.toReversed(),[0,first[1]]];
 // A small overlap hides the hinge behind the unchanged dress edge.
 const tail=[[0,first[1]],...edge.map(([x,y])=>[x+5,y]),[0,last[1]]];
 return{bodyClip:'polygon('+body.map(point).join(',')+')',tailClip:'polygon('+tail.map(point).join(',')+')',origin:point([last[0]+7,last[1]-10])};
}
