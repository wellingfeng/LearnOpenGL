#version 330 core
out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 Texcoords;

struct Material {
	sampler2D diffuse;
	sampler2D specular;
	float shininess;
};

struct Light {
	vec3 position;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant;
	float linear;
	float quadratic;
};

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
	//ambient
	vec3 ambient = light.ambient * texture(material.diffuse, Texcoords).rgb;

	//diffuse
	vec3 norm = normalize(Normal);
	vec3 lightDir = normalize(light.position - FragPos);
	float diff = max(0, dot(norm, lightDir));
	vec3 diffuse = light.diffuse * texture(material.diffuse, Texcoords).rgb * diff;

	//specular
	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 reflectDir = reflect(-norm, lightDir);
	float spec = pow(max(0,dot(viewDir,reflectDir)),material.shininess);
	vec3 specular = light.specular * texture(material.specular,Texcoords).rgb*spec;

	//attenuation
	float distance = length(light.position - FragPos);
	float attenuation = 1.0/(light.constant + light.linear*distance + light.quadratic*distance*distance);

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	vec3 result = ambient + diffuse + specular;
	FragColor = vec4(result,1.0);
}