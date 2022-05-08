package com.mencelt.musictag.controllers;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class SupervisionController {


    @GetMapping(value = "/status")
    public String getStatus(){
       return "OK";
    }


}
