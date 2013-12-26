attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
varying vec3 vNormal;
varying vec2 vTexCoord;
uniform mat4 uWorld;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
	mat4 wvp = uProjection * uView * uWorld;
	gl_Position = wvp * vec4(aPosition, 1.0);
	vTexCoord = aTexCoord;
	vNormal = aNormal;
}