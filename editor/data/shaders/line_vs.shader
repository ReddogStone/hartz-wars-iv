attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 uView;
uniform mat4 uProjection;
uniform float uWidth;
uniform vec3 uEndPoint1;
uniform vec3 uEndPoint2;
uniform vec2 uScreenSize;

void main() {
	mat4 viewProj = uProjection * uView;
	vec4 clipEnd1 = viewProj * vec4(uEndPoint1, 1.0);
	vec4 clipEnd2 = viewProj * vec4(uEndPoint2, 1.0);
	clipEnd1.xy /= clipEnd1.w;
	clipEnd2.xy /= clipEnd2.w;
	vec2 delta = clipEnd2.xy - clipEnd1.xy;
	vec2 dir = normalize(delta);
	vec2 norm = vec2(dir.y, -dir.x);

	float pixelLength = length(delta * uScreenSize);
	float width = 0.5 * uWidth / length(norm * uScreenSize);
	
	vec2 end = mix(clipEnd1.xy, clipEnd2.xy, aPosition.x);
	vec2 pos = end + norm * (aPosition.y * width);
	gl_Position = vec4(pos, 0.0, 1.0);
	
	vTexCoord = aTexCoord * vec2(pixelLength / uWidth, 1.0);
}