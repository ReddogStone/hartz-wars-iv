precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
uniform sampler2D uTexture;
void main() {
	gl_FragColor = texture2D(uTexture, vec2(vTexCoord.s, vTexCoord.t));
}
