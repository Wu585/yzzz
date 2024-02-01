define(["exports","./buildModuleUrl-8958744c","./Cartographic-3309dd0d","./Check-7b2a090c","./when-b60132fc","./Cartesian2-47311507","./AttributeCompression-90851096","./ComponentDatatype-c140a87d","./Math-119be1a3","./FeatureDetection-806b12f0"],(function(t,e,i,r,a,n,o,s,c,m){"use strict";function u(t,e){this._ellipsoid=t,this._cameraPosition=new i.Cartesian3,this._cameraPositionInScaledSpace=new i.Cartesian3,this._distanceToLimbInScaledSpaceSquared=0,a.defined(e)&&(this.cameraPosition=e)}Object.defineProperties(u.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},cameraPosition:{get:function(){return this._cameraPosition},set:function(t){var e=this._ellipsoid.transformPositionToScaledSpace(t,this._cameraPositionInScaledSpace),r=i.Cartesian3.magnitudeSquared(e)-1;i.Cartesian3.clone(t,this._cameraPosition),this._cameraPositionInScaledSpace=e,this._distanceToLimbInScaledSpaceSquared=r}}});var d=new i.Cartesian3;u.prototype.isPointVisible=function(t){return M(this._ellipsoid.transformPositionToScaledSpace(t,d),this._cameraPositionInScaledSpace,this._distanceToLimbInScaledSpaceSquared)},u.prototype.isScaledSpacePointVisible=function(t){return M(t,this._cameraPositionInScaledSpace,this._distanceToLimbInScaledSpaceSquared)};var l=new i.Cartesian3;u.prototype.isScaledSpacePointVisiblePossiblyUnderEllipsoid=function(t,e){var i,r,n=this._ellipsoid;return a.defined(e)&&e<0&&n.minimumRadius>-e?((r=l).x=this._cameraPosition.x/(n.radii.x+e),r.y=this._cameraPosition.y/(n.radii.y+e),r.z=this._cameraPosition.z/(n.radii.z+e),i=r.x*r.x+r.y*r.y+r.z*r.z-1):(r=this._cameraPositionInScaledSpace,i=this._distanceToLimbInScaledSpaceSquared),M(t,r,i)},u.prototype.computeHorizonCullingPoint=function(t,e,i){return C(this._ellipsoid,t,e,i)};var p=n.Ellipsoid.clone(n.Ellipsoid.UNIT_SPHERE);u.prototype.computeHorizonCullingPointPossiblyUnderEllipsoid=function(t,e,i,r){return C(x(this._ellipsoid,i,p),t,e,r)},u.prototype.computeHorizonCullingPointFromVertices=function(t,e,i,r,a){return S(this._ellipsoid,t,e,i,r,a)},u.prototype.computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid=function(t,e,i,r,a,n){return S(x(this._ellipsoid,a,p),t,e,i,r,n)};var h=[];u.prototype.computeHorizonCullingPointFromRectangle=function(t,r,a){var o=n.Rectangle.subsample(t,r,0,h),s=e.BoundingSphere.fromPoints(o);if(!(i.Cartesian3.magnitude(s.center)<.1*r.minimumRadius))return this.computeHorizonCullingPoint(s.center,o,a)};var f=new i.Cartesian3;function x(t,e,r){if(a.defined(e)&&e<0&&t.minimumRadius>-e){var o=i.Cartesian3.fromElements(t.radii.x+e,t.radii.y+e,t.radii.z+e,f);t=n.Ellipsoid.fromCartesian3(o,r)}return t}function C(t,e,r,n){a.defined(n)||(n=new i.Cartesian3);for(var o=E(t,e),s=0,c=0,m=r.length;c<m;++c){var u=g(t,r[c],o);if(u<0)return;s=Math.max(s,u)}return T(o,s,n)}var y=new i.Cartesian3;function S(t,e,r,n,o,s){a.defined(s)||(s=new i.Cartesian3),n=a.defaultValue(n,3),o=a.defaultValue(o,i.Cartesian3.ZERO);for(var c=E(t,e),m=0,u=0,d=r.length;u<d;u+=n){y.x=r[u]+o.x,y.y=r[u+1]+o.y,y.z=r[u+2]+o.z;var l=g(t,y,c);if(l<0)return;m=Math.max(m,l)}return T(c,m,s)}function M(t,e,r){var a=e,n=r,o=i.Cartesian3.subtract(t,a,d),s=-i.Cartesian3.dot(o,a);return!(n<0?s>0:s>n&&s*s/i.Cartesian3.magnitudeSquared(o)>n)}var b=new i.Cartesian3,v=new i.Cartesian3;function g(t,e,r){var a=t.transformPositionToScaledSpace(e,b),n=i.Cartesian3.magnitudeSquared(a),o=Math.sqrt(n),s=i.Cartesian3.divideByScalar(a,o,v);n=Math.max(1,n);var c=1/(o=Math.max(1,o));return 1/(i.Cartesian3.dot(s,r)*c-i.Cartesian3.magnitude(i.Cartesian3.cross(s,r,s))*(Math.sqrt(n-1)*c))}function T(t,e,r){if(!(e<=0||e===1/0||e!=e))return i.Cartesian3.multiplyByScalar(t,e,r)}var P=new i.Cartesian3;function E(t,e){return i.Cartesian3.equals(e,i.Cartesian3.ZERO)?e:(t.transformPositionToScaledSpace(e,P),i.Cartesian3.normalize(P,P))}var z=Object.freeze({NONE:0,BITS12:1}),N=new i.Cartesian3,I=new i.Cartesian3,B=new n.Cartesian2,_=new m.Matrix4,A=new m.Matrix4,w=Math.pow(2,12);function H(t,e,r,n,o,s){var c,u,d,l=z.NONE;if(a.defined(t)&&a.defined(e)&&a.defined(r)&&a.defined(n)){var p=t.minimum,h=t.maximum,f=i.Cartesian3.subtract(h,p,I),x=r-e;l=Math.max(i.Cartesian3.maximumComponent(f),x)<w-1?z.BITS12:z.NONE,l=z.NONE,c=t.center,u=m.Matrix4.inverseTransformation(n,new m.Matrix4);var C=i.Cartesian3.negate(p,N);m.Matrix4.multiply(m.Matrix4.fromTranslation(C,_),u,u);var y=N;y.x=1/f.x,y.y=1/f.y,y.z=1/f.z,m.Matrix4.multiply(m.Matrix4.fromScale(y,_),u,u),d=m.Matrix4.clone(n),m.Matrix4.setTranslation(d,i.Cartesian3.ZERO,d),n=m.Matrix4.clone(n,new m.Matrix4);var S=m.Matrix4.fromTranslation(p,_),M=m.Matrix4.fromScale(f,A),b=m.Matrix4.multiply(S,M,_);m.Matrix4.multiply(n,b,n),m.Matrix4.multiply(d,b,d)}this.quantization=l,this.minimumHeight=e,this.maximumHeight=r,this.center=c,this.toScaledENU=u,this.fromScaledENU=n,this.matrix=d,this.hasVertexNormals=o,this.hasWebMercatorT=a.defaultValue(s,!1)}H.prototype.encode=function(t,e,r,s,u,d,l,p){var h=s.x,f=s.y;if(this.quantization===z.BITS12){(r=m.Matrix4.multiplyByPoint(this.toScaledENU,r,N)).x=c.CesiumMath.clamp(r.x,0,1),r.y=c.CesiumMath.clamp(r.y,0,1),r.z=c.CesiumMath.clamp(r.z,0,1);var x=this.maximumHeight-this.minimumHeight,C=c.CesiumMath.clamp((u-this.minimumHeight)/x,0,1);n.Cartesian2.fromElements(r.x,r.y,B);var y=o.AttributeCompression.compressTextureCoordinates(B);n.Cartesian2.fromElements(r.z,C,B);var S=o.AttributeCompression.compressTextureCoordinates(B);n.Cartesian2.fromElements(h,f,B);var M=o.AttributeCompression.compressTextureCoordinates(B);if(t[e++]=y,t[e++]=S,t[e++]=M,this.hasWebMercatorT){n.Cartesian2.fromElements(l,0,B);var b=o.AttributeCompression.compressTextureCoordinates(B);t[e++]=b}}else i.Cartesian3.subtract(r,this.center,N),t[e++]=N.x,t[e++]=N.y,t[e++]=N.z,t[e++]=u,t[e++]=h,t[e++]=f,this.hasWebMercatorT&&(t[e++]=l);return this.hasVertexNormals&&(t[e++]=o.AttributeCompression.octPackFloat(d)),a.defined(p)&&this.isModify&&(i.Cartesian3.subtract(p,this.center,N),t[e++]=N.x,t[e++]=N.y,t[e++]=N.z),e},H.prototype.decodePosition=function(t,e,r){if(a.defined(r)||(r=new i.Cartesian3),e*=this.getStride(),this.quantization===z.BITS12){var n=o.AttributeCompression.decompressTextureCoordinates(t[e],B);r.x=n.x,r.y=n.y;var s=o.AttributeCompression.decompressTextureCoordinates(t[e+1],B);return r.z=s.x,m.Matrix4.multiplyByPoint(this.fromScaledENU,r,r)}return r.x=t[e],r.y=t[e+1],r.z=t[e+2],i.Cartesian3.add(r,this.center,r)},H.prototype.decodeTextureCoordinates=function(t,e,i){return a.defined(i)||(i=new n.Cartesian2),e*=this.getStride(),this.quantization===z.BITS12?o.AttributeCompression.decompressTextureCoordinates(t[e+2],i):n.Cartesian2.fromElements(t[e+4],t[e+5],i)},H.prototype.decodeHeight=function(t,e){return e*=this.getStride(),this.quantization===z.BITS12?o.AttributeCompression.decompressTextureCoordinates(t[e+1],B).y*(this.maximumHeight-this.minimumHeight)+this.minimumHeight:t[e+3]},H.prototype.decodeWebMercatorT=function(t,e){return e*=this.getStride(),this.quantization===z.BITS12?o.AttributeCompression.decompressTextureCoordinates(t[e+3],B).x:t[e+6]},H.prototype.getOctEncodedNormal=function(t,e,i){var r=t[e=(e+1)*this.getStride()-1]/256,a=Math.floor(r),o=256*(r-a);return n.Cartesian2.fromElements(a,o,i)},H.prototype.getStride=function(){var t;if(this.quantization===z.BITS12)t=3;else t=6;return this.hasWebMercatorT&&++t,this.hasVertexNormals&&++t,this.isModify&&(t+=3),t};var q={position3DAndHeight:0,textureCoordAndEncodedNormals:1},V={position3DAndHeight:0,textureCoordAndEncodedNormals:1,positionModify:2},O={compressed0:0,compressed1:1};H.prototype.getAttributes=function(t){var e,i=s.ComponentDatatype.FLOAT,r=s.ComponentDatatype.getSizeInBytes(i);if(this.quantization===z.NONE){var a=2;this.hasWebMercatorT&&++a,this.hasVertexNormals&&++a,e=(4+a)*r,this.isModify&&(e=(4+a+3)*r);var n=[{index:q.position3DAndHeight,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:4,offsetInBytes:0,strideInBytes:e},{index:q.textureCoordAndEncodedNormals,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:a,offsetInBytes:4*r,strideInBytes:e}];return this.isModify&&n.push({index:2,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:3,offsetInBytes:(4+a)*r,strideInBytes:e}),n}var o=3,c=0;return(this.hasWebMercatorT||this.hasVertexNormals)&&++o,this.hasWebMercatorT&&this.hasVertexNormals?(e=(o+ ++c)*r,[{index:n.compressed0,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:o,offsetInBytes:0,strideInBytes:e},{index:n.compressed1,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:c,offsetInBytes:o*r,strideInBytes:e}]):[{index:n.compressed0,vertexBuffer:t,componentDatatype:i,componentsPerAttribute:o}]},H.prototype.getAttributeLocations=function(){return this.quantization===z.NONE?this.isModify?V:q:O},H.clone=function(t,e){return a.defined(e)||(e=new H),e.quantization=t.quantization,e.minimumHeight=t.minimumHeight,e.maximumHeight=t.maximumHeight,e.center=i.Cartesian3.clone(t.center),e.toScaledENU=m.Matrix4.clone(t.toScaledENU),e.fromScaledENU=m.Matrix4.clone(t.fromScaledENU),e.matrix=m.Matrix4.clone(t.matrix),e.hasVertexNormals=t.hasVertexNormals,e.hasWebMercatorT=t.hasWebMercatorT,e},t.EllipsoidalOccluder=u,t.TerrainEncoding=H}));
