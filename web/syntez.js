function Syn(fn){
	fn.srcs = [];
	try{(Syn.wtr=fn)()}catch(e){console.error(e)}finally{delete Syn.wtr}
} Syn.i = 0;
Syn.Tez=function(val){
	function syn(val){
		if(arguments.length){
			var ov=syn.val;if(ov===val)return ov;
			syn.val=val;
			Syn.i++;
			for(var i=0,I=syn.wtrs.length;i<I;i++){
				var wtr=syn.wtrs[i];
				try{(Syn.wtr=wtr)()}catch(e){console.error(e)}
				for(var j=0,J=wtr.srcs.length;j<J;j++){
					if(wtr.srcs[j].i!==Syn.i){
						for(var src=wtr.srcs.splice(j,1)[0],k=0,K=src.wtrs.length;k<K;k++){
							if(src.wtrs[k]===wtr){src.wtrs.splice(k,1);break}
						}
					}
				}
			}
			Syn.free(ov);
			return ov
		}else{
			syn.i=Syn.i;
			if(Syn.wtr){if(!syn.wtrs.includes(Syn.wtr)){syn.wtrs[syn.wtrs.length]=Syn.wtr;Syn.wtr.srcs[Syn.wtr.srcs.length]=syn}}
			return syn.val
		}
	}
	syn.wtrs=[];
	syn.val=val===undefined?null:val;
	return syn
};
Syn.free=function(deleting){
	var fn=deleting;
	if(!fn||!fn.srcs)return;
	for(var i=0;i<fn.srcs.length;i++){
		var wtrs=fn.srcs[i].wtrs;
		var idx=wtrs.indexOf(fn);
		if(idx!==-1)wtrs.splice(idx,1)
	}
	fn.srcs.length=0;
	if(deleting){
		if(fn.wtrs)fn.wtrs.length=0;
		fn.val=undefined;
		fn.i=0
	}
}