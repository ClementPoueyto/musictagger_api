package com.mencelt.musictag.repository.specifications;

import com.mencelt.musictag.entities.TagEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.Set;


@Component
public class TagSpecification {

    public Specification<TagEntity> searchTags(String userId, String name, List<String> filters){
        String finalName = name.toLowerCase();
        return (root, query, criteriaBuilder)
                -> {
            Predicate predicateUser = criteriaBuilder.equal(root.get("userId"), userId);
            Predicate predicateSearch = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("track").get("name")), "%"+ finalName +"%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("track").get("albumName")), "%"+ finalName +"%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("track").get("artistName")), "%"+ finalName +"%")
                    );
            Predicate predicateFilter = criteriaBuilder.conjunction();
            for(String filter : filters){
                predicateFilter = criteriaBuilder.and(predicateFilter,criteriaBuilder.isMember(filter,root.get("tags")));
            }
            return criteriaBuilder.and(predicateUser, predicateSearch, predicateFilter);
        };
    }
}
