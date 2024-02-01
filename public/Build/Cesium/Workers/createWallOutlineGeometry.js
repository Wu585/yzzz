define(["./when-b60132fc","./Cartesian2-47311507","./buildModuleUrl-8958744c","./Cartographic-3309dd0d","./ComponentDatatype-c140a87d","./Check-7b2a090c","./GeometryAttribute-06a41648","./GeometryAttributes-252e9929","./IndexDatatype-8a5eead4","./Math-119be1a3","./FeatureDetection-806b12f0","./WallGeometryLibrary-b3b432bb","./Event-16a2dfbf","./RuntimeError-4a5c8994","./WebGLConstants-4ae0db90","./Cartesian4-3ca25aab","./arrayRemoveDuplicates-d2f048c5","./PolylinePipeline-3454449c","./EllipsoidGeodesic-0f19ac62","./EllipsoidRhumbLine-ed1a6bf4","./IntersectionTests-a793ed08","./Plane-a3d8b3d2"],(function(e,i,t,a,n,r,o,s,l,d,m,u,p,f,c,h,g,y,v,E,_,b){"use strict";var C=new a.Cartesian3,H=new a.Cartesian3;function A(t){var n=(t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT)).positions,r=t.maximumHeights,o=t.minimumHeights,s=e.defaultValue(t.granularity,d.CesiumMath.RADIANS_PER_DEGREE),l=e.defaultValue(t.ellipsoid,i.Ellipsoid.WGS84);this._positions=n,this._minimumHeights=o,this._maximumHeights=r,this._granularity=s,this._ellipsoid=i.Ellipsoid.clone(l),this._workerName="createWallOutlineGeometry";var m=1+n.length*a.Cartesian3.packedLength+2;e.defined(o)&&(m+=o.length),e.defined(r)&&(m+=r.length),this.packedLength=m+i.Ellipsoid.packedLength+1}A.pack=function(t,n,r){var o;r=e.defaultValue(r,0);var s=t._positions,l=s.length;for(n[r++]=l,o=0;o<l;++o,r+=a.Cartesian3.packedLength)a.Cartesian3.pack(s[o],n,r);var d=t._minimumHeights;if(l=e.defined(d)?d.length:0,n[r++]=l,e.defined(d))for(o=0;o<l;++o)n[r++]=d[o];var m=t._maximumHeights;if(l=e.defined(m)?m.length:0,n[r++]=l,e.defined(m))for(o=0;o<l;++o)n[r++]=m[o];return i.Ellipsoid.pack(t._ellipsoid,n,r),n[r+=i.Ellipsoid.packedLength]=t._granularity,n};var k=i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),w={positions:void 0,minimumHeights:void 0,maximumHeights:void 0,ellipsoid:k,granularity:void 0};return A.unpack=function(t,n,r){var o;n=e.defaultValue(n,0);var s,l,d=t[n++],m=new Array(d);for(o=0;o<d;++o,n+=a.Cartesian3.packedLength)m[o]=a.Cartesian3.unpack(t,n);if((d=t[n++])>0)for(s=new Array(d),o=0;o<d;++o)s[o]=t[n++];if((d=t[n++])>0)for(l=new Array(d),o=0;o<d;++o)l[o]=t[n++];var u=i.Ellipsoid.unpack(t,n,k),p=t[n+=i.Ellipsoid.packedLength];return e.defined(r)?(r._positions=m,r._minimumHeights=s,r._maximumHeights=l,r._ellipsoid=i.Ellipsoid.clone(u,r._ellipsoid),r._granularity=p,r):(w.positions=m,w.minimumHeights=s,w.maximumHeights=l,w.granularity=p,new A(w))},A.fromConstantHeights=function(i){var t,a,n=(i=e.defaultValue(i,e.defaultValue.EMPTY_OBJECT)).positions,r=i.minimumHeight,o=i.maximumHeight,s=e.defined(r),l=e.defined(o);if(s||l){var d=n.length;t=s?new Array(d):void 0,a=l?new Array(d):void 0;for(var m=0;m<d;++m)s&&(t[m]=r),l&&(a[m]=o)}return new A({positions:n,maximumHeights:a,minimumHeights:t,ellipsoid:i.ellipsoid})},A.createGeometry=function(i){var r=i._positions,p=i._minimumHeights,f=i._maximumHeights,c=i._granularity,h=i._ellipsoid,g=u.WallGeometryLibrary.computePositions(h,r,f,p,c,!1);if(e.defined(g)){var y,v=g.pos.bottomPositions,E=g.pos.topPositions,_=E.length,b=2*_,A=new Float64Array(b),k=0;for(_/=3,y=0;y<_;++y){var w=3*y,G=a.Cartesian3.fromArray(E,w,C),L=a.Cartesian3.fromArray(v,w,H);A[k++]=L.x,A[k++]=L.y,A[k++]=L.z,A[k++]=G.x,A[k++]=G.y,A[k++]=G.z}var x=new s.GeometryAttributes({position:new o.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:A})}),P=b/3;b=2*P-4+P;var D=l.IndexDatatype.createTypedArray(P,b),T=0;for(y=0;y<P-2;y+=2){var V=y,I=y+2,R=a.Cartesian3.fromArray(A,3*V,C),S=a.Cartesian3.fromArray(A,3*I,H);if(!a.Cartesian3.equalsEpsilon(R,S,d.CesiumMath.EPSILON10)){var M=y+1,N=y+3;D[T++]=M,D[T++]=V,D[T++]=M,D[T++]=N,D[T++]=V,D[T++]=I}}return D[T++]=P-2,D[T++]=P-1,new o.Geometry({attributes:x,indices:D,primitiveType:m.PrimitiveType.LINES,boundingSphere:new t.BoundingSphere.fromVertices(A)})}},function(t,a){return e.defined(a)&&(t=A.unpack(t,a)),t._ellipsoid=i.Ellipsoid.clone(t._ellipsoid),A.createGeometry(t)}}));
