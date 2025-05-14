using UnityEngine;

public class Barra : MonoBehaviour
{
    public GameObject[] objetos;
    public int contador = 0; // contador

    void Update()
    {
        if (contador == 0)
        {
            objetos[0].GetComponent<SpriteRenderer>().enabled = true;
        }
        else{
            objetos[0].GetComponent<SpriteRenderer>().enabled = false;
        }
    }
}
