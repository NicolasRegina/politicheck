# 0003: Sistema de Colorimetría y Neutralidad Política

> **Estado:** Reemplazado (*Superseded*) por [ADR-0008: Identidad Visual Editorial Contemporánea, Espectro No-Partidario y Rediseño UX](./0008-editorial-identity-and-ux-redesign.md). Se conserva como registro histórico de la doctrina original de neutralidad partidaria.

## Contexto
En la política argentina, los colores primarios (violeta para LLA, celeste/azul para el peronismo/kirchnerismo, amarillo para el PRO, rojo para la izquierda) tienen una carga ideológica inmediata. Asignar colores partidarios a la interfaz general o a la barra de cobertura mediática generaría acusaciones de sesgo partidario hacia la plataforma.

## Decisión
1. **Lienzo e Identidad Institucional**: Se adopta una paleta **100% monocromática técnica de alta gama ("Zinc & Carbon")**. Los fondos, tarjetas, botones de acción y el logo de Politicheck utilizan exclusivamente escalas de gris carbón, grafito, pizarra y platino (#090D16, #111827, #1F2937, #F8FAFC), sin tintes partidarios.
2. **Barra de Espectro de Medios**: Se implementa en **escala monocromática de contraste técnico** (Alternativa A). Los segmentos de cobertura se diferencian por intensidad lumínica y densidad de gris (platino para oficialismo, pizarra para centro/datos y grafito para oposición), apoyados por porcentajes numéricos y etiquetas de texto explícitas. Se reevaluará tras el primer prototipo visual si requiere matices desaturados.
3. **Reserva Exclusiva de Colores Partidarios**: Los colores identitarios de los partidos quedan reservados **única y exclusivamente para la sección de Candidatos y Promesas (Fase 2)**, utilizándose únicamente en citas textuales, píldoras de autoría y perfiles oficiales del candidato (ej: píldora violeta para citas de Javier Milei, roja para Nicolás del Caño, celeste para referentes del peronismo), donde el color representa objetivamente la pertenencia partidaria del emisor y no el juicio de la plataforma.
