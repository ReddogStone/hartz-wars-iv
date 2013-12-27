precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;

uniform sampler2D uTexture;
uniform vec3 uDirLight1;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	
	vec3 toLight = normalize(uDirLight1 - vWorldPos);
	float light = clamp(dot(toLight, vNormal), 0.0, 1.0);
	
	gl_FragColor = light * textureColor;
}