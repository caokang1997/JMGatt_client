idf_component_register(SRCS "main.c" "ble_toilet.c" "asr_pro.c" "debug_console.c"
                    INCLUDE_DIRS "."
                    REQUIRES bt driver nvs_flash console)
