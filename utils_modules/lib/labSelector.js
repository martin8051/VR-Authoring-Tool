exports.getLab = function (labScene = "")
{
	let labCode = "";
	switch(labScene)
	{
		case "chemistry":
			labCode = `
			        <!-- Asset Management System -->
			        <a-assets>
					  <audio id="music1" src= "/assets/chemistry/audiomethane.mp3"></audio>
					  <audio id="music2" src= "/assets/chemistry/audioflask.mp3"></audio>
					  <img id = "play" src="/assets/chemistry/playbutt.png">
					  <img id = "pause" src="/assets/chemistry/pause.png">
			          <a-asset-item id="tools" src="/assets/chemistry/model.obj"></a-asset-item>   
			          <a-asset-item id="lab" src="/assets/chemistry/lab.gltf"></a-asset-item>
					  <a-asset-item id="tools-m" src="/assets/chemistry/materials.mtl"></a-asset-item>
					  <a-asset-item id="flask" src="/assets/chemistry/potion.obj"></a-asset-item>
					  <a-asset-item id="flask-m" src="/assets/chemistry/potion.mtl"></a-asset-item>
					  <a-asset-item id="methane" src="/assets/chemistry/methane.obj"></a-asset-item>
					  <a-asset-item id="methane-m" src="/assets/chemistry/methane.mtl"></a-asset-item>
					  <video id="labv" src="/assets/chemistry/labv.mp4" audtoplay loop="true"></video>
					 </a-assets>
			
					<a-camera camera=""  position="-4.702 1.92769 -3.5471" rotation="0 30 0" look-controls="" wasd-controls="" data-aframe-inspector-original-camera="">
					<a-cursor material="" raycaster="" cursor="" geometry="">
					</a-cursor></a-camera>
			        <!-- Lab model -->
					<a-entity position="4.044 0.747 -1.383" rotation="-0.08 0.17 0.05">		</a-entity>
			        <a-entity scale="0.020 0.020 0.020" position="-8.00 -1.710 2.670" gltf-model="#lab"></a-entity>
			
			        <!-- Tool model -->
			         <a-entity position="-0.088 1.260 -3.842" obj-model="obj : #tools; mtl: #tools-m"></a-entity> 
			         <a-entity scale="0.1 0.1 0.1"  position="-2.299 0.737 0.600" obj-model="obj : #flask; mtl: #flask-m" sound ="src :#music2; on: click; volume:1; refDistance: 1" color-toggle>
					 </a-entity> 
					 <a-entity scale="0.03 0.03 0.03"  position="2.255 0.622 -6.438" obj-model="obj : #methane; mtl: #methane-m" sound ="src :#music1; on: click; volume:1; refDistance: 1" log="message: Hello, Metaverse!"></a-entity> 
					 
			    	<a-video src="#labv" width="8" height="4.5" position="2.958 2.11698 -2.29181" material="" geometry="" rotation="0 270 0" scale="0.6 0.6 1">
					<a-image id="videoControls" src="#play" position = "-0.15108 3.189 -0.82576" play-pause>
					</a-image>		
					</a-video>`;
			break;
		case "biology":
			labCode = `
		        <!-- Asset Management System -->
		        <a-assets>
		          <a-asset-item id="lab" src="/assets/biology/lab.obj"></a-asset-item>   
				  <a-asset-item id="lab-m" src="/assets/biology/lab.mtl"></a-asset-item>
				  
				  <a-asset-item id="dna" src="/assets/biology/dna.obj"></a-asset-item>
				  <a-asset-item id="dna-m" src="/assets/biology/dna.mtl"></a-asset-item>
				  
				  <a-asset-item id="corona" src="/assets/biology/corona.obj"></a-asset-item>
		          <a-asset-item id="corona-m" src="/assets/biology/corona.mtl"></a-asset-item>
				 </a-assets>
		      
		        <a-simple-sun-sky sun-position="0.5 0.5 1"></a-simple-sun-sky>
		        <a-entity light="type: ambient; color: #BBB"></a-entity>
		        <a-entity id="directional" light="type:  point;  color:  #ea0606;  intensity:  0;  angle:  90;  groundColor:  #d80e0e;  distance:  20;  castShadow:  true"></a-entity> 
		        <a-entity id="directional" light="type: directional; color: #FFF; intensity: 1.3" position="-0.5 1 -2"></a-entity> 
			   
		         <a-entity position="-14.286 -1.357 -4.158" scale="0.05 0.05 0.05" obj-model="obj : #lab; mtl: #lab-m"></a-entity> 
		         <a-entity position="-11.289 0.492 -2.212"  scale="0.2 0.2 0.1" obj-model="obj : #dna; mtl: #dna-m"></a-entity> 
				 <a-entity obj-model="obj: #corona mtl: #corona-m" position="1.087 1.365 -0.456" scale="0.001 0.001 0.001"></a-entity>`;
			break;
		case "physics":
			labCode = `
		        <a-assets>
		          <!-- <img id="celing" src="/assets/celing.jpg">  -->
		          <a-asset-item id="lab" src="/assets/physics/model.gltf"></a-asset-item>   
		          <a-asset-item id="heart-o" src="/assets/physics/corona.obj"></a-asset-item>
		          <a-asset-item id="heart-m" src="/assets/physics/corona.mtl"></a-asset-item>
		          <a-asset-item id="physics-o" src="/assets/physics/physics.obj"></a-asset-item>
		          <a-asset-item id="physics-m" src="/assets/physics/physics.mtl"></a-asset-item>
		          <a-asset-item id="skull-o" src="/assets/physics/skull.obj"></a-asset-item>
		          <a-asset-item id="skull-m" src="/assets/physics/skull.mtl"></a-asset-item>
		        </a-assets>
		        <!-- Celing -->
		        <!-- <a-sky src="#celing"></a-sky> -->
		
		        <!-- Lab model -->
		        <a-entity position="0 1.5 0" gltf-model="#lab"></a-entity>
		
		        <!-- Sun and Sky model -->
		        <a-simple-sun-sky sun-position="0.5 0.5 1"></a-simple-sun-sky>
		        <a-entity light="type: ambient; color: #BBB"></a-entity>
		        <a-entity id="directional" light="type: directional; color: #FFF; intensity: 1.3" position="0.5 1 2"></a-entity> 
		        <a-entity id="directional" light="type: directional; color: #FFF; intensity: 1.3" position="-0.5 1 -2"></a-entity> 
		
		        <!-- Heart model -->
		        <!--  <a-entity obj-model="obj: #heart-o; mtl: #heart-m"
		                            position="1.087 1.365 -0.456"
		                            scale="0.001 0.001 0.001"></a-entity> -->
		        <a-entity obj-model="obj: #physics-o; mtl: #physics-m"
		                            position="-2.326 1.389 1.012"
		                            scale="0.001 0.001 0.001"></a-entity>
		         <!-- <a-entity obj-model="obj: #skull-o; mtl: #skull-m"
		                            position="2 1.2 0.5"
		                            scale="20 20 20"></a-entity>-->`;
			break;
		default:
			break;
	}
    return labCode;
}