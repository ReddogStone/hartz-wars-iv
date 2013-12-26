attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
varying vec3 vNormal;
varying vec2 vTexCoord;
uniform vec3 uPos;

void main() {
	gl_Position = vec4(uPos + aPosition, 1.0);
	vTexCoord = aTexCoord;
	vNormal = aNormal;
}