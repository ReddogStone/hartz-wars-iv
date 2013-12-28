precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec4 uColor;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	textureColor *= uColor * textureColor.a;
	
	gl_FragColor = textureColor;
}