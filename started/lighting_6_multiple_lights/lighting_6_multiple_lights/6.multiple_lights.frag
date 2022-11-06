#version 330 core
out vec4 FragColor;

struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
};

struct DirLight {
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct PointLight {
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

#define NR_POINT_LIGHTS 4

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

uniform vec3 viewPos;
uniform Material material;
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform SpotLight spotLight;

//function prototypes
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir);
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main()
{
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    vec3 result = CalcDirLight(dirLight, norm, viewDir);
    for(int i=0; i<NR_POINT_LIGHTS; i++)
    {
        result += CalcPointLight(pointLights[i], norm, FragPos, viewDir);
    }

    result += CalcSpotLight(spotLight, norm, FragPos, viewDir);

    FragColor = vec4(result, 1.0);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    //diffuse shading
    float diff = max(0, dot(normal, lightDir));
    //specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(0,dot(viewDir, reflectDir)), material.shininess);
    //combine results
    vec3 ambient = texture(material.diffuse, TexCoords).rgb * light.ambient ;
    vec3 diffuse = light.diffuse * texture(material.diffuse, TexCoords).rgb * diff;
    vec3 specular = light.specular * texture(material.specular, TexCoords).rgb * spec;

    return ambient + diffuse + specular;
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    //diffuse
    float diff = max(0, dot(normal, lightDir));
    //specualr
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(0, dot(viewDir, reflectDir)), material.shininess);
    //attenuation
    float distance = length(light.position-fragPos);
    float attenuation = 1.0/(light.constant + light.linear*distance + light.quadratic*distance*distance);
    //combine
    vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;
    vec3 diffuse = light.diffuse * texture(material.diffuse, TexCoords).rgb * diff;
    vec3 specular = light.specular * texture(material.specular, TexCoords).rgb * spec;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return (ambient + diffuse + specular);
}

vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    //diffuse
    float diff = max(0, dot(lightDir, normal));
    //specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(0, dot(reflectDir, viewDir)), material.shininess);
    //attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0/(light.constant + light.linear*distance + light.quadratic*distance*distance);
    //spotlight intensity
    float theta = dot(-lightDir, normalize(light.direction));
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff)/epsilon, 0.0, 1.0);
    //combine
    vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;
    vec3 diffuse = light.diffuse * texture(material.diffuse, TexCoords).rgb * diff;
    vec3 specular = light.specular * texture(material.specular, TexCoords).rgb * spec;

    ambient *= attenuation*intensity;
    diffuse *= attenuation*intensity;
    specular *= attenuation*intensity;

    return (ambient + diffuse + specular);
}