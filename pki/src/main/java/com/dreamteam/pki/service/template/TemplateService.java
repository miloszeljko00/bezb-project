package com.dreamteam.pki.service.template;

import com.dreamteam.pki.model.Template;
import com.dreamteam.pki.repository.ITemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {
    @Autowired
    ITemplateRepository templateRepository;

    public Template create(Template template){
        return templateRepository.save(template);
    }

    public List<Template> getAll(){
        return templateRepository.findAll();
    }
}
