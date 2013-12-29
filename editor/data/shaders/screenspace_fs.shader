precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec4 uColor;

void main() {
	vec4 color = texture2D(uTexture, vTexCoord);
	color *= uColor;
	gl_FragColor = color;
}