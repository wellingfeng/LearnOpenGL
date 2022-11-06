#version 330 core
out vec4 FragColor;

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
};

in vec3 FragPos;
in vec3 Normal;
in vec2 Texcoords;

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
	float diff = max(dot(norm, lightDir), 0);
	vec3 diffuse = light.diffuse * texture(material.diffuse, Texcoords).rgb * diff;

	//specular
	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(reflectDir, viewDir),0), material.shininess);
	vec3 specular = light.specular * texture(material.specular, Texcoords).rgb *spec;

	vec3 result = ambient + diffuse + specular;

	FragColor = vec4(result,1.0);
}