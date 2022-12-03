#version 330 core
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D screenTexture;
const float offset = 1/300.0;

void main()
{
//	vec3 col = texture(screenTexture, TexCoords).rgb;
//	FragColor = vec4(1-col, 1.0);

//	float average = (col.r + col.g + col.b)/3.0;
//	FragColor = vec4(average,average,average,1.0);

//	float average = 0.2126*col.r + 0.7152*col.g + 0.0722*col.b;
//	FragColor = vec4(average,average,average,1.0);

	vec2 offset[9] = vec2[](
		vec2(-offset, offset),
		vec2(0.0f, offset),
		vec2(offset, offset),
		vec2(-offset, 0.0f),
		vec2(0.0f, 0.0f),
		vec2(offset, 0.0f),
		vec2(-offset, -offset),
		vec2(0.0f, -offset),
		vec2(offset, -offset)
	);

//	float kernel[9] = float[]
//	(
//		-1, -1, -1,
//		-1, 9, -1,
//		-1, -1, -1
//	);

//float kernel[9] = float[](
//    1.0 / 16, 2.0 / 16, 1.0 / 16,
//    2.0 / 16, 4.0 / 16, 2.0 / 16,
//    1.0 / 16, 2.0 / 16, 1.0 / 16  
//);
//
float kernel[9] = float[](
    1, 1, 1,
    1, -8, 1,
    1, 1, 1  
);

	vec3 samplerTex[9];
	for(int i=0;i<9;i++)
	{
		samplerTex[i] = vec3(texture(screenTexture, TexCoords.st + offset[i]));
	}

	vec3 col = vec3(0.0);
	for(int i=0;i<9;i++)
	{
		col += samplerTex[i] * kernel[i];
	}

	FragColor = vec4(col,1.0);
}