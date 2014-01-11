attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aWorldPos;
attribute vec2 aSize;
attribute vec4 aColor;

varying vec2 vTexCoord;
varying vec4 vColor;

uniform mat4 uView;
uniform mat4 uProjection;
uniform vec2 uScreenSize;

void main() {
	vTexCoord = aTexCoord;
	vColor = aColor;
	
	vec3 worldPos = aWorldPos;
	vec2 size = aSize;
	
	vec4 clipPos = uProjection * uView * vec4(aWorldPos, 1.0);
	vec2 clipSize = vec2(2.0, 2.0) * aSize / uScreenSize;
	gl_Position = vec4(clipPos.xy / clipPos.w + aPosition.xy * clipSize, clipPos.z / clipPos.w, 1.0);
}