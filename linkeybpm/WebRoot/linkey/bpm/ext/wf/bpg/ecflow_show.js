var goalClickStyle="";
var thisobj;
var goalPrvNode=new Array();
var goalNextNode=new Array();

//鼠标左键按下时
function div1.onmousedown()
{
	CancelPrvNextNode();
	if(event.srcElement.parentElement.id=="div1"||event.srcElement.parentElement.parentElement.id=="div1")
    {
        	if(event.srcElement.parentElement.id=="div1"){thisobj=event.srcElement;}
        	else{thisobj=event.srcElement.parentElement;}
        	ChangeObjStyle(thisobj);
    }else{thisobj=event.srcElement;}
}

//鼠标按下放开后
function div1.onmouseup()
{
	ChangeObjStyle();
}

//节点双击事件
function SetProperty (a,b){
   alert(a+b);
}

//鼠标按下时加粗节点的边框线
function ChangeObjStyle(obj)
{
	if(obj){
		if(goalClickStyle!=obj.id)
		{
			obj.strokeweight+=1;
			obj.style.zIndex="1200";
			goalClickStyle=obj.id;
		}
	}
	else
	{
		if(goalClickStyle!="")
		{
			try{
				var oldobj=document.getElementById(goalClickStyle);
				oldobj.strokeweight-=1;
				if(oldobj.tagName=="polyline")
				{
					oldobj.style.zIndex="1";	
				}
				else
				{
					oldobj.style.zIndex="10";
				}
			}
			catch(e){}
			goalClickStyle="";
		}
	}
}

//显示后继节点
function ShowNextNode(obj) 
{
	var LinkeyStartStr=obj.LinkeyStartObj;
	if(LinkeyStartStr!=""&&LinkeyStartStr!=undefined)
	{
		var mobjarray=LinkeyStartStr.split(",");
		for(i=0;i<mobjarray.length;i++)
		{
			var startpos=mobjarray[i].indexOf("_");
			var endpos=mobjarray[i].length;
			var NodeNum=mobjarray[i].substring(startpos+1,endpos);
			var NodeObj=eval("Node"+NodeNum);
			goalNextNode[goalNextNode.length]="Node"+NodeNum+"$$"+NodeObj.fillcolor+","+NodeObj.id+"$$"+NodeObj.firstChild.color2;
			NodeObj.fillcolor="#f8feb0";
			NodeObj.firstChild.color2="#fad01e";
		}
	}
}

//显示前导节点
function ShowPrvNode(obj)
{
	var LinkeyEndStr=obj.LinkeyEndObj;
	if(LinkeyEndStr!=""&&LinkeyEndStr!=undefined)
	{
		var mobjarray=LinkeyEndStr.split(",");
		for(i=0;i<mobjarray.length;i++)
		{
			var startpos=mobjarray[i].indexOf("polyline");
			var endpos=mobjarray[i].indexOf("_");
			var NodeNum=mobjarray[i].substring(startpos+8,endpos);
			var NodeObj=eval("Node"+NodeNum);
			goalPrvNode[goalPrvNode.length]="Node"+NodeNum+"$$"+NodeObj.fillcolor+","+NodeObj.id+"$$"+NodeObj.firstChild.color2;
			NodeObj.fillcolor="#f8feb0";
			NodeObj.firstChild.color2="#fad01e";
		}
	}
}

//取消前导或后继节点的色彩
function CancelPrvNextNode()
{
	var tempStr="";
	var tempArray="";
	var tempObj="";
	var getObj="";
	for(i=0;i<goalPrvNode.length;i++)
	{
		cancelNodeError(goalPrvNode[i]);
	}
	for(i=0;i<goalNextNode.length;i++)
	{
		cancelNodeError(goalNextNode[i]);
	}
	function cancelNodeError(tempStr)
	{
		tempArray=tempStr.split(",");
		for(j=0;j<tempArray.length;j++)
		{
			tempObj=tempArray[j].split("$$");
			var NodeName=tempObj[0];
			var NodeObj=eval(NodeName);
			var NodeColor=tempObj[1];
			if(NodeObj.tagName=="polyline")
			{
				NodeObj.strokecolor=NodeColor;
			}
			else
			{
				if(j==0){NodeObj.fillcolor=NodeColor;}else{NodeObj.firstChild.color2=NodeColor;}
			}
		}
	}
	goalPrvNode=new Array();
	goalNextNode=new Array();
}

//增加节点的右键
Ext.onReady(function()
{
	Ext.get("div1").on('contextmenu',function(e)
	{
		var menu = new Ext.menu.Menu();
		if(thisobj!=null)
		{
			var Nodeid=thisobj.id;

			//人工节点
			if(thisobj.NodeType=="Activity")
			{
				 menu.add(new Ext.menu.Item({text: '指定处理用户',handler: function(){SetNodeUser(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '显示前导节点',handler: function(){ShowPrvNode(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '显示后继节点',handler: function(){ShowNextNode(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '取消设置',handler: function(){DelNodeUser(thisobj)}}));
			}

			//子流程节点
			if(thisobj.NodeType=="SubProcess")
			{
				 menu.add(new Ext.menu.Item({text: '指定子流程仿真策略',handler: function(){SetSubProcess(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '显示前导节点',handler: function(){ShowPrvNode(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '显示后继节点',handler: function(){ShowNextNode(thisobj)}}));
				  menu.add(new Ext.menu.Item({text: '取消设置',handler: function(){DelNodeUser(thisobj)}}));
			}

			//网关，开始节点,结束节点，自动活动节点
			if(thisobj.NodeType=="Edge"||thisobj.NodeType=="StartNode"||thisobj.NodeType=="EndNode"||thisobj.NodeType=="AutoActivity")
			{
				 menu.add(new Ext.menu.Item({text: '显示前导节点',handler: function(){ShowPrvNode(thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '显示后继节点',handler: function(){ShowNextNode(thisobj)}}));
			}
			//路由线
			if(thisobj.tagName=="polyline")
			{
				 menu.add(new Ext.menu.Item({text: '强制路由',handler: function(){SetRouter("2",thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '禁止路由',handler: function(){SetRouter("3",thisobj)}}));
				 menu.add(new Ext.menu.Item({text: '取消设置',handler: function(){SetRouter("4",thisobj)}}));
			}
			//流程空白处点击时
			if(thisobj.id=="div1")
			{
				  menu.add(new Ext.menu.Item({text: '查看流程全局属性',handler: function(){ }}));
				  menu.add(new Ext.menu.Item({text: '其他菜单',handler: function(){ }}));
			}

			e.preventDefault();
			menu.showAt(e.getXY());

		}
	});
	InitNode(); //初始化节点和色彩
}); 



//功能函数开始
function InitNode()
{
	var AllObjNum=document.all.length;
	var ObjArray=new Array();
	var j=0;
	for (i=0; i<AllObjNum; i++) 
	{
		var obj=document.all(i);
		if(obj.tagName=="polyline")
		{
			ObjArray[j]=obj;
			j=j+1;
		}
	}
	for(i=0;i<ObjArray.length;i++)
	{
		var obj=ObjArray[i];
		if(obj.oldpoints!="")
		{
			obj.points.value=obj.oldpoints;
		}
	}
	if(document.all.div1.style.display=="none")
	{
		setTimeout(function(){document.all.div1.style.display="";},200);
	}
	setTimeout(function(){try{Ext.get('loading').remove();Ext.get('loading-mask').fadeOut({remove:true});}catch(e){}}, 100);
}


//设置节点图标
function SetNodeImage(Nodeid){
	for (var i=0; i<document.all.length; i++) 
	{
		try{
			var NodeObj=document.all(i);
			if(NodeObj.Nodeid==nodeid){
				var objx=parseInt(NodeObj.style.left)+5;
				var objy=parseInt(NodeObj.style.top)+5;
				var tempStr="<v:rect id=\"User_"+Nodeid+"\" GroupId='"+NodeObj.id+"' style='position:absolute;left:"+objx+";text-align:left;margin-top:"+objy+";width:16px;height:16px;z-index:251658240' stroked=\"f\"></v:rect>";
				var cobj=div1.document.createElement(tempStr);
				div1.appendChild(cobj);
				cobj.innerHTML+='<v:fill src="linkey/bpm/images/icons/user.gif" o:title="user" recolor="t" rotate="t" type="frame"/>';
			}
		}catch(e){}
	}
}
